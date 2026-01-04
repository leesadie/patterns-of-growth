#!/usr/bin/env python
# coding: utf-8

# # View 1
# 
# How have training compute, parameter count, power draw, training dataset size, training cost, and training time scaled over time, and how do these trends differ across domains and organization types?

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

df = df_subset.copy()
df['publication_date'] = pd.to_datetime(df['publication_date'])
df['year'] = df['publication_date'].dt.year
df['log_compute'] = np.log10(df['training_compute_(flop)'])
df['log_params'] = np.log10(df['parameters'])
df['log_power_draw'] = np.log10(df['training_power_draw_(w)'])
df['log_time'] = np.log10(df['training_time_(hours)'])
df['log_cost'] = np.log10(df['training_compute_cost_(2023_usd)'])

x_bins = 60
y_bins = 40
df['y_bin'] = pd.cut(df['log_compute'], bins=y_bins, labels=False)

year_bins = pd.cut(df['year'], bins=x_bins)
df['x_bin'] = year_bins.cat.codes
year_midpoints = year_bins.apply(lambda x: x.mid)
df['x_mid'] = year_midpoints

hex_df = df.groupby(['year', 'y_bin']).agg(
    count=('model', 'size'),
    mean_log_compute=('log_compute', 'mean'),
    mean_log_params=('log_params', 'mean'),
    mean_log_pd=('log_power_draw', 'mean'),
    mean_log_time=('log_time', 'mean'),
    mean_log_cost=('log_cost', 'mean')
).reset_index()

hex_df['y_pos'] = hex_df['y_bin']

hex_df.head()


# ## Visualization

# In[5]:


# Interactions

# Y-axis selection dropdown
y_axis_drop = alt.binding_select(
    options=['compute', 'params', 'power', 'time', 'cost'],
    labels=['Training compute (FLOPs)', 'Trainable parameters', 'Power draw', 'Training time', 'Training cost'],
    name='Y-axis: '
)
y_axis_select = alt.param('y_axis_select', bind=y_axis_drop, value='compute')

# Categorize by color dropdown
category_drop = alt.binding_radio(
    options=["None", "domain_top4", "country_top8", "org_top5"],
    labels=["None", "Domain", "Country", "Organization type"],
    name="Categorize models: "
)
category_select = alt.param("category_select", bind=category_drop, value="None")

# X-axis (year) brush
brush = alt.selection_interval(encodings=['x'], value={'x': [1950, 1980]}, name='brush')

# Deep learning checkbox
deep_learning_checkbox = alt.binding_checkbox(name='Show deep learning era ')
show_dl_era = alt.param('show_dl_era', bind=deep_learning_checkbox, value=False)

# Search model name
search_input = alt.param(
    value='',
    bind=alt.binding(
        input='search',
        placeholder='Model name',
        name='Find a model: ',
    )
)

search_matches = alt.expr.test(alt.expr.regexp(search_input, "i"), alt.datum.model)

# Select point on scatter
point_select = alt.selection_point(fields=['year'], on='click', empty=True)


# In[6]:


# Deep learning box overlay
deep_learning_box = alt.Chart(pd.DataFrame({
    "start": [2010],
    "end": [2025]
})).mark_rect(
    color='#7EC6E3',
    opacity=0.15
).encode(
    alt.X('start:Q'),
    x2='end:Q',
    y=alt.value(0),
    y2=alt.value(300)
).transform_filter(show_dl_era)

# Deep learning text
deep_learning_text = alt.Chart(pd.DataFrame({
    "start": [2010],
    "end": [2025],
    "label": ["Deep Learning Era"]
})).mark_text(
    align='left',
    baseline='bottom',
    dx=40,
    dy=5,
    fontSize=12,
    fontWeight='bold',
    color='black'
).encode(
    alt.X('start:Q'),
    y=alt.value(290),
    text='label:N'
).transform_filter(show_dl_era)


# In[7]:


hexagon = "M0,-2.3094010768L2,-1.1547005384 2,1.1547005384 0,2.3094010768 -2,1.1547005384 -2,-1.1547005384Z"

hex = alt.Chart(hex_df).add_params(y_axis_select, brush, point_select).transform_calculate(
    y_field=alt.expr.if_(
    y_axis_select=='compute', alt.datum.mean_log_compute,
    alt.expr.if_(
        y_axis_select=='params', alt.datum.mean_log_params,
        alt.expr.if_(
            y_axis_select=='power', alt.datum.mean_log_pd,
            alt.expr.if_(
                y_axis_select=='time', alt.datum.mean_log_time,
                alt.datum.mean_log_cost
            )
        )
    )
)
).mark_point(
    size=18, shape=hexagon, stroke='black', strokeWidth=0
).encode(
    alt.X('year:Q', axis=alt.Axis(title='Publication year', format='d')),
    alt.Y('y_pos:Q', axis=alt.Axis(title='Mean log metric')),
    fill=alt.Fill('y_field:Q', scale=alt.Scale(scheme='darkblue'), title='Mean log metric'),
    opacity=alt.when(point_select).then(alt.value(0.95)).otherwise(alt.value(0.3)),
    tooltip=[
        alt.Tooltip('year:Q', title='Year'),
        alt.Tooltip('y_field:Q', title='Mean log metric', format='.2f')
    ]
)

hex_full = alt.layer(
    deep_learning_box,
    deep_learning_text,
    hex
).add_params(show_dl_era).resolve_scale(
    color='independent'
).encode(
    x=alt.X(scale=alt.Scale(domain=[df['year'].min(), df['year'].max()]))
).properties(
    width=1000,
    height=300
)

hex_full


# In[8]:


# Color based on category
color_enc = alt.condition(
    (category_select != "None"),
    alt.Color("category_field:N", legend=alt.Legend(title="Category")),
    alt.value("#334EAD")
)


# In[9]:


# Base for scatter
base = alt.Chart(df_subset).transform_calculate(
    y_field=alt.expr.if_(
        y_axis_select=='compute', alt.datum['training_compute_(flop)'],
        alt.expr.if_(
            y_axis_select=='params', alt.datum['parameters'],
            alt.expr.if_(
                y_axis_select=='power', alt.datum['training_power_draw_(w)'],
                alt.expr.if_(
                    y_axis_select=='time', alt.datum['training_time_(hours)'],
                    alt.datum['training_compute_cost_(2023_usd)']
                )
            )
        )
    ),
    category_field=(
        "datum[category_select] || 'Uncategorized'"
    ),
).transform_filter(
    brush
).encode(
    alt.X("year:O", title='Publication year', axis=alt.Axis(labelAngle=0)),
    alt.Y("y_field:Q", title='Log metric', scale=alt.Scale(type='log')),
    color=color_enc,
    tooltip = [
        alt.Tooltip('model:N', title='Model'),
        alt.Tooltip('publication_date:T', title='Publication date'),
        alt.Tooltip('organization:N', title='Organization'),
        alt.Tooltip('country:N', title='Country'),
        alt.Tooltip('training_compute_(flop):Q', title='Training compute'),
        alt.Tooltip('parameters:Q', title='Parameters'),
        alt.Tooltip('training_power_draw_(w):Q', title='Power draw'),
        alt.Tooltip('training_time_(hours):Q', title='Compute cost (USD)'),
        alt.Tooltip('training_compute_cost_(2023_usd):Q', title='Training time (hours)')
    ]
)


# In[10]:


# Points
# Select from legend
category_selection = alt.selection_point(fields=['category_field'], bind='legend')

points = base.mark_circle(size=60, opacity=0.7).encode(
    opacity=alt.when(category_selection).then(alt.value(0.9)).otherwise(alt.value(0.2))
).add_params(
    category_selection,
    point_select
)

# Label if search match
labels = base.mark_text(
    align='left',
    dx=7,
    dy=-3,
    fontSize=10
).encode(
    text=alt.condition((search_matches & (search_input != '')), 'model:N', alt.value(''))
)


# In[11]:


# Layer
scatter = alt.layer(
    points,
    labels
).resolve_scale(
    color='shared'
).properties(
    width=1000,
    height=300
).add_params(
    y_axis_select, category_select, search_input
)


# In[12]:


final = (hex_full & scatter).properties(
    title=alt.Title(
        'AI models have become increasingly resource-intensive over time.', 
        subtitle='Plots show consistent growth in model scale with an increase during the deep learning era (2010-2025).',
        anchor='start', dx=10, dy=-10, fontSize=16, subtitlePadding=6, subtitleFontSize=12
    )
).configure(
    font='Helvetica Neue'
)

final