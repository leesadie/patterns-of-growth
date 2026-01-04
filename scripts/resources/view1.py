#!/usr/bin/env python
# coding: utf-8

# # View 1
# 
# How has model efficiency changed over time, and how do release patterns contextualize these changes?

# In[1]:


import pandas as pd
import numpy as np
import altair as alt


# In[2]:


df = pd.read_csv('../../../data/processed/models_final.csv')
df.head()


# In[3]:


# Select necessary columns
df_subset = df[['model', 'training_compute_(flop)', 'training_power_draw_(w)', 'training_dataset_size_(gradients)', 'training_time_(hours)', 'training_compute_cost_(2023_usd)',
          'domain_group', 'organization_categorization', 'publication_date', 'link', 'reference', 'organization', 'parameters', 'notable_model', 'country', 'model_accessibility', 'year', 'era']]

# Ensure publication date is datetime
df_subset['publication_date'] = pd.to_datetime(df_subset['publication_date'])

# Ensure notable model is bool
df_subset['notable_model'] = df_subset['notable_model'].astype(bool)

# Drop NAs in compute
df_subset = df_subset.dropna(subset=['training_compute_(flop)'])

# Select top countries in terms of model releases
top_countries = df_subset['country'].value_counts().nlargest(8).index.tolist()
df_subset['country_top8'] = df_subset['country'].where(df_subset['country'].isin(top_countries), 'Other')

# Select top domains in terms of model releases
top_domains = df_subset['domain_group'].value_counts().nlargest(4).index.tolist()
df_subset['domain_top4'] = df_subset['domain_group'].where(df_subset['domain_group'].isin(top_domains), 'Other')

# Select top organization types in terms of model releases
top_orgs = df_subset['organization_categorization'].value_counts().nlargest(5).index.tolist()
df_subset['org_top5'] = df_subset['organization_categorization'].where(df_subset['organization_categorization'].isin(top_orgs), 'Other')

df_subset.head()


# In[4]:


# Focus Data Set for this analysis

# Focus variables for cost and efficiency analysis
focus_vars = [
    "model",
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

# Drop NaN values
df_focus.dropna(subset=["training_compute_(flop)", "training_compute_cost_(2023_usd)", "training_time_(hours)", "training_power_draw_(w)"], inplace=True)

# Derived efficiency metrics
df_focus["flops_per_dollar"] = df_focus["training_compute_(flop)"] / df_focus["training_compute_cost_(2023_usd)"]
df_focus["flops_per_watt"]   = df_focus["training_compute_(flop)"] / df_focus["training_power_draw_(w)"]
df_focus["flops_per_hour"]   = df_focus["training_compute_(flop)"] / df_focus["training_time_(hours)"]

df_focus['frontier_model'] = df_focus['frontier_model'].map({
    True: 'Frontier',
    False: 'Non-Frontier'
})

df_focus.head()


# In[5]:


# Aggregate efficiency metrics

efficiency_df = df_focus.melt(
    id_vars=[
        'model', 'year', 'organization', 'frontier_model', 'parameters', 'training_compute_(flop)',
        'training_compute_cost_(2023_usd)', 'training_power_draw_(w)', 'training_time_(hours)'
    ],
    value_vars=['flops_per_dollar', 'flops_per_watt', 'flops_per_hour'],
    var_name='metric',
    value_name='efficiency'
)

# Clean
efficiency_df = efficiency_df.dropna(subset=['year', 'efficiency'])
efficiency_df = efficiency_df[efficiency_df['efficiency'] > 0].copy()
efficiency_df['year'] = efficiency_df['year'].astype(int)

efficiency_df['metric'] = efficiency_df['metric'].map({
    "flops_per_dollar": 'FLOPs / $',
    "flops_per_watt": 'FLOPs / Watt',
    "flops_per_hour": 'FLOPs / Hour'
})

efficiency_df.head()


# In[6]:


# Filter top 5 orgs by count per year

top_orgs = df_focus.groupby('organization').size().nlargest(5).index.tolist()


# In[7]:


# Interaction

# Dropdown for org selection
org_drop = alt.binding_select(options=['All'] + top_orgs, name='Top organization: ')
org_select = alt.param('org_param', bind=org_drop, value='All')

# Frontier model selection
frontier_select = alt.selection_point(fields=['frontier_model'], bind='legend')

# Metric select
metric_select = alt.selection_point(fields=['metric'], name='metric_select')


# In[8]:


# Line 

line_df = (
    df_focus
    .dropna(subset=['year', 'flops_per_dollar', 'flops_per_watt', 'frontier_model'])
    .groupby('year', as_index=False)
    .agg({
        'flops_per_dollar': 'median',
        'flops_per_watt': 'median',
        'flops_per_hour': 'median'
    })
    .melt(id_vars=['year'], 
          value_vars=['flops_per_dollar', 'flops_per_watt', 'flops_per_hour'], 
          var_name='metric', 
          value_name='efficiency')
)

line_df['metric'] = line_df['metric'].map({
    "flops_per_dollar": 'FLOPs / $',
    "flops_per_watt": 'FLOPs / Watt',
    "flops_per_hour": 'FLOPs / Hour'
})

line = alt.Chart(line_df).add_params(metric_select).mark_line(point=True).encode(
    alt.X('year:O', title='Year', axis=alt.Axis(labelAngle=0)),
    alt.Y('efficiency:Q', title='Median efficiency (log scale)', scale=alt.Scale(type='log')),
    alt.Color('metric:N', title='Metric'),
    opacity = alt.when(metric_select).then(alt.value(0.9)).otherwise(alt.value(0.3)),
    tooltip = [
        alt.Tooltip('year:N', title='Year'),
        alt.Tooltip('metric:N', title='Metric'),
        alt.Tooltip('efficiency:Q', title='Efficiency', format='.2f')
    ]
).properties(
    width=1000,
    height=300
)

line


# In[9]:


# Scatter

scatter = alt.Chart(efficiency_df).add_params(
    org_select, metric_select
).transform_filter(
    (org_select == 'All') | (alt.datum.organization == org_select)
).mark_circle().encode(
    alt.X('year:O', title='Year', axis=alt.Axis(labelAngle=0)),
    alt.Y('efficiency:Q', title='Efficiency', scale=alt.Scale(type='log')),
    alt.Color('metric:N', title='Metric'),
    opacity = alt.when(metric_select).then(alt.value(0.9)).otherwise(alt.value(0.3)),
    tooltip = [
        alt.Tooltip('organization:N', title='Organization'),
        alt.Tooltip('frontier_model:N', title='Frontier status'),
        alt.Tooltip('metric:N', title='Metric'),
        alt.Tooltip('efficiency:Q', title='Efficiency', format='.2f')
    ]
).properties(
    width=400,
    height=300,
    title=alt.Title(
        'Efficiency Metrics per Model', anchor='start'
    )
)

scatter


# add radio buttons for metric

# In[10]:


# Bar chart

bars = alt.Chart(df_focus).add_params(frontier_select).mark_bar().encode(
    alt.X('year:O', title='Year', axis=alt.Axis(labelAngle=0)),
    alt.Y('count():Q', title='Model count'),
    alt.Color('frontier_model:N', title='Frontier status', scale=alt.Scale(domain=['Frontier', 'Non-Frontier'], range=['#F49C30','#45A7CE'])),
    opacity=alt.when(frontier_select).then(alt.value(0.9)).otherwise(alt.value(0.3)),
    tooltip = [
        alt.Tooltip('year:O', title='Year'),
        alt.Tooltip('frontier_model:N', title='Frontier status'),
        alt.Tooltip('count():Q', title='Model count')
    ]
).properties(
    width = 400,
    height = 300,
    title=alt.Title(
        'Frontier Model Release Counts per Year', anchor='start'
    )
)

bars


# In[11]:


final = (line & (bars | scatter).resolve_legend(color='independent').resolve_scale(color='independent')).resolve_legend(color='independent').resolve_scale(color='independent').resolve_axis(y='independent').properties(
    title=alt.Title(
        'Efficiency metrics have increased across the deep learning era', subtitle='The models with the highest training compute FLOPs per hour are frontier models', anchor='start', fontSize=16
    )
)
final


# In[ ]:




