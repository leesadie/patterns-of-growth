#!/usr/bin/env python
# coding: utf-8

# # View 2
# 
# How have model accessibility levels changed over time, and how is accessibility related to training compute?

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

df_access = df_subset.copy()

open_levels = {
    'Open weights (unrestricted)',
    'Open weights (restricted use)',
    'Open weights (non-commercial)',
    'API access',
    'Hosted access (no API)'
}

closed_levels = {
    'Unreleased',
    'Unknown'
}

# Map model accessibility levels to open/closed
def group_access(x):
    if x in open_levels:
        return "Open"
    elif x in closed_levels:
        return "Closed"
    else:
        return "Other" # fallback
    
df_access['access_group'] = df['model_accessibility'].apply(group_access)

# Combine model and compute for text annotation
df_access['model_and_compute'] = df_access.apply(
    lambda x: f"{x['model']} - {x['training_compute_(flop)']:.2e} FLOPs",
    axis=1
)

df_access.head()


# In[5]:


# Interactions

# Year range brush
brush = alt.selection_interval(encodings=['x'], value={'x': [2006, 2016]}, name='brush')

# Select from legend
category_selection = alt.selection_point(fields=['model_accessibility'], bind='legend')

# Outline bar on click
click_bar = alt.selection_point(fields=['model_accessibility'], empty=False)


# In[6]:


line = alt.Chart(df_access).add_params(brush).mark_line(point=True).encode(
    alt.X('year:Q', title='Publication year', axis=alt.Axis(format='d')),
    alt.Y('mean(training_compute_(flop)):Q', title='Training compute (FLOPs)', scale=alt.Scale(type='log')),
    alt.Color('access_group:N', scale=alt.Scale(domain=['Open', 'Closed'], range=['#BF903D', '#45A7CE']), title='Accessibiility'),
    tooltip=[
        alt.Tooltip('year(publication_date):T', title='Publication year'),
        alt.Tooltip('access_group:N', title='Accessibility'),
        alt.Tooltip('mean(training_compute_(flop)):Q', title='Log-mean compute'),
    ]
).properties(
    width=500,
    height=300,
    title=alt.Title('Open and closed model log-mean compute', anchor='start', frame='group', offset=10, 
                    subtitle='Note that open refers to all levels of open weights, hosted access, and API access.',
                    subtitleFontSize=10, subtitleColor='gray')
)

line


# In[7]:


access_order = [
    "Open weights (unrestricted)",
    "Open weights (restricted use)",
    "Open weights (non-commercial)",
    "API access",
    "Hosted access (no API)",
    "Unreleased",
    "Unknown"
]

bar_colors = [
    "#C7E5F0", "#ABD7E9", "#8FCAE2",
    "#6AB9D8", "#45A7CE", "#2984A8", "#1D617B"
]

bars = alt.Chart(df_access).add_params(brush, category_selection, click_bar).transform_filter(brush).mark_bar().encode(
    alt.X('count():Q', title='Count'),
    alt.Y('model_accessibility:O', title='Accessibility level', sort=access_order),
    alt.Color('model_accessibility:O', title='Accessibility level', scale=alt.Scale(domain=access_order, range=bar_colors)),
    opacity=alt.when(category_selection).then(alt.value(0.95)).otherwise(alt.value(0.3)),
    stroke = alt.condition(click_bar, alt.value('gray'), alt.value('transparent')),
    strokeWidth=alt.condition(click_bar, alt.value(2), alt.value(0)),
    tooltip=[
        alt.Tooltip('count():Q', title='Model count')
    ]
).properties(
    width=300,
    height=300,
    title=alt.Title('Accessibility levels for year range', anchor='start', frame='group', offset=10)
)

bars


# In[8]:


top_text = alt.Chart(df_access).transform_filter(click_bar).transform_filter(brush).transform_window(
    rank='rank(-training_compute_(flop))'
).transform_filter(alt.datum.rank <= 1).transform_calculate(
    line_index = 'datum.rank - 1'
).mark_text(
    align='left',
    baseline='middle',
    dy=alt.ExprRef('datum.line_index * 15 + 10'),
    dx=-100
).encode(
    alt.Y('model_accessibility:O', sort=access_order),
    text=alt.Text('model_and_compute:N')
)


# In[9]:


title_text = alt.Chart(df_access).transform_filter(click_bar).transform_filter(brush).transform_window(
    rank='rank(-training_compute_(flop))'
).transform_filter(alt.datum.rank <= 1).transform_calculate(
    title_text='"Top model (compute) - " + datum.year'
).mark_text(
    align='left',
    baseline='top',
    fontWeight='bold',
    dx=-100,
    dy=-10,
    fontSize=12
).encode(
    alt.Y('model_accessibility:O', sort=access_order),
    text=alt.Text('title_text:N')
)


# In[10]:


text = top_text + title_text


# In[11]:


final = (line | (bars + text)).resolve_legend(color='independent').resolve_scale(color='independent').properties(
    title=alt.Title(
        'AI model accessibility has diversified with narrowing compute gaps.', 
        subtitle='Open versus closed models have converged in log-mean compute as levels of model accessibility have expanded.',
        fontSize=16, anchor='start', dx=10, dy=-10, subtitlePadding=6, subtitleFontSize=12
    )
).configure(
    font='Helvetica Neue'
)

final


# In[ ]:




