#!/usr/bin/env python
# coding: utf-8

# # View 2
# 
# Exploring changes in training compute and training cost over time for frontier and non frontier models

# In[1]:


import pandas as pd
import numpy as np
import altair as alt


# In[2]:


df = pd.read_csv('../../../data/processed/models_final.csv')
df.head()


# In[3]:


# Focus Data Set for this analysis

# Focus variables for cost and efficiency analysis
focus_vars = [
    "training_compute_(flop)",
    "training_compute_cost_(2023_usd)",
    "training_power_draw_(w)",
    "training_time_(hours)",
    "training_dataset_size_(gradients)",
    "parameters",
    "year",
    "organization",
    "frontier_model"
]

# Subset the main dataset
df_focus = df[focus_vars].copy()

# Derived efficiency metrics
df_focus["flops_per_dollar"] = df_focus["training_compute_(flop)"] / df_focus["training_compute_cost_(2023_usd)"]
df_focus["flops_per_watt"]   = df_focus["training_compute_(flop)"] / df_focus["training_power_draw_(w)"]
df_focus["flops_per_hour"]   = df_focus["training_compute_(flop)"] / df_focus["training_time_(hours)"]
df_focus["flops_per_sample"] = df_focus["training_compute_(flop)"] / df_focus["training_dataset_size_(gradients)"]
df_focus["cost_per_param"]   = df_focus["training_compute_cost_(2023_usd)"] / df_focus["parameters"]

# Replace inf and drop impossible values
df_focus.replace([np.inf, -np.inf], np.nan, inplace=True)
df_focus.dropna(subset=["training_compute_(flop)", "training_compute_cost_(2023_usd)", "frontier_model", "year"], inplace=True)

df_focus['frontier_model'] = df_focus['frontier_model'].map({
    True: 'Frontier',
    False: 'Non-Frontier'
})

df_focus.head()


# In[4]:


slider = alt.binding_range(
    name='Year:',
    min=df_focus['year'].min(),
    max=df_focus['year'].max(),
    step=1
)

year_param = alt.param(
    name='selected_year', # This is the parameter name we'll use in the filter
    value=df_focus['year'].max(), # Set a default value
    bind=slider
)

legend_sel = alt.selection_point(
    fields=["frontier_model"],     # field used in your legend
    bind="legend"                  # enables click-through legend interactivity
)


# In[5]:


# Line
flops_colors = {
    "Frontier": "#1E88E5",    
    "Non-Frontier": "#D43D3D"
}

cost_colors = {
    "Frontier": "#673AB7",     
    "Non-Frontier": "#FF8C00"
}

opacityL = alt.condition(
    legend_sel,
    alt.value(1.0),     # Selected line: fully visible
    alt.value(0.15)     # Non-selected lines: dimmed
)

df_yearly = (
    df_focus
    .groupby(["year", "frontier_model"], as_index=False)
    .agg({
        "training_compute_(flop)": "mean",
        "training_compute_cost_(2023_usd)": "mean"
    })
)


# In[57]:


line1 = alt.Chart(df_yearly).mark_line(point=True).encode(
    alt.X("year:O", title="Year", axis=alt.Axis(labelAngle=0)),
    alt.Y("training_compute_(flop):Q", title="Training Compute (FLOP) (log)", scale=alt.Scale(type='log')),
    alt.Color("frontier_model:N", title="Frontier Status", scale=alt.Scale(domain=["Frontier", "Non-Frontier"], range=[flops_colors["Frontier"], flops_colors["Non-Frontier"]])),
    opacity=alt.when(legend_sel).then(alt.value(0.9)).otherwise(alt.value(0.3)),
    tooltip=[
        alt.Tooltip("year:O", title="Year"),
        alt.Tooltip("frontier_model:N", title="Model type"),
        alt.Tooltip("training_compute_(flop):Q", title="Training compute (FLOPs)")
    ]
).properties(
    width=600,
    height=300,
    title="Training Compute (FLOPs) Over Time (log-scale)"
).add_params(legend_sel)

line1

line2 = alt.Chart(df_yearly).mark_line(point=True).encode(
    alt.X("year:O", title="Year", axis=alt.Axis(labelAngle=0)),
    alt.Y("training_compute_cost_(2023_usd):Q", title="Training Cost (USD) (log)", scale=alt.Scale(type='log')),
    alt.Color("frontier_model:N", title="Frontier Status", scale=alt.Scale(domain=["Frontier", "Non-Frontier"], range=[cost_colors["Frontier"], cost_colors["Non-Frontier"]])),
    opacity=alt.when(legend_sel).then(alt.value(0.9)).otherwise(alt.value(0.3)),
    tooltip=[
        alt.Tooltip("year:O", title="Year"),
        alt.Tooltip("frontier_model:N", title="Model type"),
        alt.Tooltip("training_compute_cost_(2023_usd):Q", title="Training compute (FLOPs)")
    ]
).properties(
    width=600,
    height=300,
    title="Training Cost (USD) Over Time (log-scale)"
).add_params(legend_sel)

line2

mark_line = (
    alt.Chart(df_focus).mark_rule(color='black', strokeWidth=0.5).encode(
        x=alt.X("year:O", title=None),
        tooltip=[alt.Tooltip(alt.datum.year, title='Selected Year')]
    ).transform_filter(
        alt.datum.year == year_param
    )
)

line1f = (line1 + mark_line).add_params(year_param)
line2f = (line2 + mark_line).add_params(year_param)



lines = alt.vconcat(line1f, line2f).resolve_scale(color='independent')

lines


# In[58]:


# select_compute = alt.selection_point(fields=['training_compute_(flop)'], on='click', empty=True)
# select_cost = alt.selection_point(fields=['training_compute_cost_(2023_usd)'], on='click', empty=True)

# Compute Bar
compute_bar = (
    alt.Chart(df_focus.dropna(subset=['frontier_model','training_compute_(flop)', 'year'])).mark_boxplot().encode(
        x=alt.X('frontier_model:N', title='Frontier'),
        y=alt.Y('training_compute_(flop):Q', title='Training Compute (FLOPs, log)', scale=alt.Scale(type='log')
        ),
        color=alt.Color(
            "frontier_model:N",
            title="Model Type",
            scale=alt.Scale(domain=["Frontier", "Non-Frontier"], range=[flops_colors["Frontier"], flops_colors["Non-Frontier"]]),
            legend=None
        )#,
        #opacity=alt.when(legend_sel).then(alt.value(0.9)).otherwise(alt.value(0.3))
    ).transform_filter(
        alt.datum.year == year_param
    ).properties(
        width=220, height=270, title='Compute by Frontier for Year (log)'
    ).add_params(year_param)
)

# Cost Bar
cost_bar = (
    alt.Chart(df_focus.dropna(subset=['frontier_model','training_compute_cost_(2023_usd)', 'year'])).mark_boxplot().encode(
        x=alt.X('frontier_model:N', title='Frontier'),
        y=alt.Y('training_compute_cost_(2023_usd):Q', title='Training cost USD (log)', scale=alt.Scale(type='log')
        ),
        color=alt.Color(
            "frontier_model:N",
            scale=alt.Scale(domain=["Frontier", "Non-Frontier"], range=[cost_colors["Frontier"], cost_colors["Non-Frontier"]]),
            legend=None
        )#,
        #opacity=alt.when(legend_sel).then(alt.value(0.9)).otherwise(alt.value(0.3))
    ).transform_filter(
        alt.datum.year == year_param
    ).properties(
        width=220, height=270, title='Cost by Frontier for Year (log)'
    ).add_params(year_param)
)

boxes = alt.vconcat(compute_bar, cost_bar).add_params(year_param).resolve_scale(color='independent')

boxes


# In[59]:


final = alt.hconcat(
    lines, boxes, spacing=60
).properties(
    title=alt.Title(
        'Trends in AI Training Compute and Cost Over Time', 
        subtitle='Exponential growth in AI model compute is paralleled by rapidly growing training costs.',
        fontSize=16, anchor='start', dx=10, dy=-10, subtitlePadding=12, subtitleFontSize=12
    )
).configure(
    font='Helvetica Neue'
)

final


# In[12]:


final.save('chart2_dle.json')


# In[ ]:




