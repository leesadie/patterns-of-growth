#!/usr/bin/env python
# coding: utf-8

# # View 3
# 
# How has a model’s resource efficiency (i.e. cost per FLOP, cost per parameter, compute per dollar, compute per watt) evolved over time, and do metrics exhibit diminishing returns?

# ## Imports and setup

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


# View-specific data

df_efficiency = df_subset.copy()

# Lower = better
df_efficiency['cost_per_flop'] = np.log10(df_efficiency['training_compute_cost_(2023_usd)'] / df_efficiency['training_compute_(flop)'])
df_efficiency['cost_per_param'] = np.log10(df_efficiency['training_compute_cost_(2023_usd)'] / df_efficiency['parameters'])

# Higher = better
df_efficiency['compute_per_dollar'] = np.log10(df_efficiency['training_compute_(flop)'] / df_efficiency['training_compute_cost_(2023_usd)'])
df_efficiency['compute_per_watt'] = np.log10(df_efficiency['training_compute_(flop)'] / df_efficiency['training_power_draw_(w)'])

lower_better = ['cost_per_flop', 'cost_per_param']
higher_better = ['compute_per_dollar', 'compute_per_watt']

# Normalize 
for m in lower_better:
    df_efficiency[f"{m}_norm"] = 1 - (df_efficiency[m] - df_efficiency[m].min()) / (df_efficiency[m].max() - df_efficiency[m].min())

for m in higher_better:
    df_efficiency[f"{m}_norm"] = (df_efficiency[m] - df_efficiency[m].min()) / (df_efficiency[m].max() - df_efficiency[m].min())

# Composite efficiency index
metrics = [f"{m}_norm" for m in lower_better + higher_better]
df_efficiency['composite_efficiency'] = df_efficiency[metrics].mean(axis=1)

df_efficiency.head()


# In[5]:


# Interaction

brush = alt.selection_interval(encodings=['x'], value={'x': [2021, 2025]}, name='brush')

# Checkbox to show year-to-year percent change
pct_checkbox = alt.binding_checkbox(name='Show yearly percent change ')
show_pct = alt.param('show_pct', bind=pct_checkbox, value=False)


# In[6]:


base = alt.Chart(df_efficiency).add_params(brush, show_pct).transform_aggregate(
    mean_composite_efficiency='mean(composite_efficiency)',
    groupby=['year']
).transform_window(
    prev='lag(mean_composite_efficiency)',
    sort=[alt.SortField('year')]
).transform_calculate(
    pct_change="(datum.mean_composite_efficiency - datum.prev) / datum.prev"
).mark_line(color='#4D9EC8').encode(
    alt.X('year:Q', title='Publication year', axis=alt.Axis(format='d'), scale=alt.Scale(domain=[2011, 2025])),
    alt.Y('mean_composite_efficiency:Q', title='Mean composite efficiency', scale=alt.Scale(domain=[0, 0.7])),
    tooltip=[
        alt.Tooltip('year:Q', title='Year'),
        alt.Tooltip('mean_composite_efficiency:Q', title='Mean composite efficiency', format='.2f'),
        alt.Tooltip('pct_change:Q', title='Percent change', format='.2f')
    ]
)


# In[7]:


# Text labels

text = base.mark_text(
    dy=-10,
    fontSize=10,
    color='#333',
    fontWeight='bold'
).encode(
    text=alt.condition("!isNaN(datum.pct_change)", alt.Text('pct_change:Q', format='.1%'), alt.value('')),
    opacity=alt.condition(show_pct, alt.value(0.95), alt.value(0))
)


# In[8]:


line = (base + text).properties(
    width=1000,
    height=250
)

line


# In[9]:


metrics_norm = [
    'Cost per FLOP',
    'Cost per parameter',
    'Compute per dollar',
    'Compute per watt'
]

rename_map = {
    'cost_per_flop_norm': 'Cost per FLOP',
    'cost_per_param_norm': 'Cost per parameter',
    'compute_per_dollar_norm': 'Compute per dollar',
    'compute_per_watt_norm': 'Compute per watt'
}

df_efficiency = df_efficiency.rename(columns=rename_map)

df_efficiency_long = df_efficiency.melt(
    id_vars=['year'],
    value_vars=list(rename_map.values()),
    var_name='metric',
    value_name='metric_value'
)

df_efficiency_long.head()


# In[10]:


alt.data_transformers.disable_max_rows()

range_ = [
    '#39758D', '#334EAD', '#77BEFC', '#ECB75B'
]

bars = alt.Chart(df_efficiency_long).add_params(brush).transform_filter(brush).mark_bar(width=20).encode(
    alt.X('year:O', title='Year range', sort='ascending', axis=alt.Axis(labelAngle=0)),
    alt.Y('mean(metric_value):Q', title='Normalized metric value'),
    alt.Color('metric:N', title='Metric', scale=alt.Scale(domain=metrics_norm, range=range_)),
    alt.XOffset('metric:N'),
    tooltip=[
        alt.Tooltip('metric:N', title='Metric'),
        alt.Tooltip('mean(metric_value):Q', title='Metric value', format='.2f')
    ]
).properties(
    title=alt.Title('Metric composition for year range', anchor='start', frame='group', offset=10)
)

bars


# In[11]:


scatter = alt.Chart(df_efficiency).add_params(brush).transform_filter(brush).mark_circle(color='#334EAD', size=60).encode(
    alt.X('composite_efficiency:Q', title='Efficiency index'),
    alt.Y('training_compute_(flop):Q', title='Training compute (FLOPs)', scale=alt.Scale(type='log')),
    tooltip=[
        alt.Tooltip('year', title='Year'),
        alt.Tooltip('composite_efficiency:Q', title='Composite efficiency', format='.2f'),
        alt.Tooltip('training_compute_(flop):Q', title='Training compute (FLOPs)')
    ]
).properties(
    title=alt.Title('Model Compute vs. efficiency for year range', anchor='start', frame='group', offset=10)
)


# In[12]:


final = (line & (bars | scatter).resolve_scale(color='independent').resolve_legend(color='independent')).properties(
    title=alt.Title(
        'AI models have become more resource-efficient as overall scale grows.', 
        subtitle='Cost per parameter and compute per watt lead yearly contributions, with models increasingly clustered around moderate efficiency levels (0.5-0.7).',
        fontSize=16, anchor='start', dx=10, dy=-10, subtitlePadding=6, subtitleFontSize=12
    )
)
final


# In[ ]:




