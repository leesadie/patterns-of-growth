#!/usr/bin/env python
# coding: utf-8

# # View 3
# 
# How do efficiency, cost, and scale metrics correlate with each other and how have these relations changed across time

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
df_focus.dropna(subset=["training_compute_(flop)", "training_compute_cost_(2023_usd)"], inplace=True)

df_focus['frontier_model'] = df_focus['frontier_model'].map({
    True: 'Frontier',
    False: 'Non-Frontier'
})

df_focus.head()


# In[4]:


slider = alt.binding_range(
    name='Year:',
    min=df_focus['year'].min()+6,
    max=df_focus['year'].max()-2,
    step=1
)

# max and min values adjusted such that our range only includes years with 
# enough information to provide valuable insight to our vis

year_param = alt.param(
    name='selected_year', 
    value=df_focus['year'].max()-4,
    bind=slider
)

corr_selection = alt.selection_point(
    fields=['var1', 'var2'],  
    nearest=True,
    on='click',              
    name='corr_select',
    value=[{'var1': 'Compute (FLOPs)', 'var2': 'Cost (USD)'}]
)


# In[5]:


# Pandas data work to make it possible to display a changing heatmap 
# Essentially what im doing is calculating the heatmap values for each year separately, 
# making a data set that stoes them and then filtering through that data set on altair

focus_cols = [
    'training_compute_(flop)','training_compute_cost_(2023_usd)',
    'training_power_draw_(w)','training_time_(hours)',
    'training_dataset_size_(gradients)','parameters',
    'flops_per_dollar','flops_per_watt'
]

all_correlations = []
unique_years = df_focus['year'].unique()

for year in unique_years:
    df_year = df_focus[df_focus['year'] == year]
    df_corr_data = df_year[focus_cols].replace([np.inf, np.nan], np.nan).dropna()
    corr_matrix = df_corr_data.corr()
    df_corr_long = corr_matrix.stack().reset_index()
    df_corr_long.columns = ['var1', 'var2', 'corr']
    df_corr_long['year'] = year
    all_correlations.append(df_corr_long)

df_corr_all = pd.concat(all_correlations, ignore_index=True)

title_map = {
    'training_compute_(flop)': 'Compute (FLOPs)',
    'training_compute_cost_(2023_usd)': 'Cost (USD)',
    'training_power_draw_(w)': 'Power Draw (W)',
    'training_time_(hours)': 'Time (Hours)',
    'training_dataset_size_(gradients)': 'Dataset Size (Gradients)',
    'parameters': 'Parameters',
    'flops_per_dollar': 'FLOPs per Dollar',
    'flops_per_watt': 'FLOPs per Watt'
}

df_corr_all['var1'] = df_corr_all['var1'].map(title_map)
df_corr_all['var2'] = df_corr_all['var2'].map(title_map)


# In[6]:


heat = alt.Chart(df_corr_all).transform_filter(
        alt.datum.year == year_param
  ).mark_rect().encode(
      alt.X('var1:N', title=''),
      alt.Y('var2:N', title=''),
      alt.Color('corr:Q', scale=alt.Scale(domain=[-1,1], scheme='darkblue', reverse=True), legend=alt.Legend(title="Correlation Scale")),
      tooltip=['var1','var2', alt.Tooltip('corr:Q', format='.2f')]
  ).properties(
      width=400, height=400, title='Correlation Heat Map (focus metrics)'
  )

final_heat = heat.add_params(year_param, corr_selection)

final_heat


# In[7]:


static_variable_order = [
    'Compute (FLOPs)',
    'Cost (USD)',
    'Dataset Size (Gradients)',
    'FLOPs per Dollar',
    'FLOPs per Watt',
    'Parameters',
    'Power Draw (W)',
    'Time (Hours)'
]

bar = alt.Chart(df_corr_all).transform_filter(
    alt.datum.year == year_param
).transform_filter(
    alt.datum.var1 != alt.datum.var2
).mark_bar().encode(
    x=alt.X('corr:Q', title='Correlation Coefficient (ρ)'),
    y=alt.Y('var2:N', title='Correlated Variable', sort=static_variable_order),
    color=alt.Color('corr:Q', scale=alt.Scale(domain=[-1, 1], scheme='darkblue', reverse=True), legend=None),
    tooltip=[
        alt.Tooltip('var1:N', title='Focus Variable'),
        alt.Tooltip('var2:N', title='Correlates With'),
        alt.Tooltip('corr:Q', format='.2f', title='Correlation (ρ)')
    ]
).properties(
    width = 300,
    height = 400,
    title='Yearly Correlation Breakdown'
).add_params(year_param)

bar


# In[8]:


final = (final_heat | bar).properties(
    title=alt.Title(
        'Correlation Patterns Among Key AI Training Metrics (Focus Dataset)', 
        subtitle='Exploring how compute, cost, efficiency, and model scale interrelate on a year-by-year basis to reveal emerging trends in modern AI.',
        fontSize=16, anchor='start', dx=10, dy=-10, subtitlePadding=6, subtitleFontSize=12
    )
).configure(
    font='Helvetica Neue'
)

final


# In[9]:


final.save('chart3_dle.json')

