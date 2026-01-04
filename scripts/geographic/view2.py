#!/usr/bin/env python
# coding: utf-8

# # View 3
# How do AI-related academic publication intensity and export controls on semiconductors relate to model size (parameters) and training compute across countries and organizations?

# # Imports and data wrangling

# In[19]:


import pandas as pd
import numpy as np
import altair as alt

alt.data_transformers.disable_max_rows()


# In[20]:


df = pd.read_csv('../../../data/processed/models_final.csv')
df.head()


# In[21]:


# Clean data

# Drop rows that break log or bins
df = df.dropna(subset=[
    'parameters',
    'training_compute_(flop)',
    'publication_count',
    'export_controls_sum',
    'year',
    'organization_categorization'
])

df = df[
    (df['parameters'] > 0) &
    (df['training_compute_(flop)'] > 0) &
    (df['publication_count'] > 0)
].copy()

# Log features
df['log_params'] = np.log10(df['parameters'])
df['log_compute'] = np.log10(df['training_compute_(flop)'])

# Publication intensity bins
df['pub_bin'] = pd.qcut(
    df['publication_count'],
    q=3,
    labels=['Low', 'Medium', 'High']
)

# Export-control bins
df['export_bin'] = pd.qcut(
    df['export_controls_sum'],
    q=3,
    labels=['Low', 'Medium', 'High']
)


# In[22]:


top_countries = (
    df['country_first']
    .dropna()
    .value_counts()
    .nlargest(10)
    .index
    .tolist()
)

country_param = alt.param(
    name='country_param',
    bind=alt.binding_select(
        options=top_countries,
        name='Country: '
    ),
    value=top_countries[0]
)


# In[23]:


# Scatter plot for params vs compute

# Color range
range_ = [
    '#ECB75B', '#39758D', '#334EAD', '#77BEFC'
]

# Select from legend
category_selection = alt.selection_point(fields=['organization_categorization'], bind='legend')

scatter = (
    alt.Chart(df)
    .add_params(country_param, category_selection).transform_filter(alt.datum.country_first == country_param)
    .mark_circle()
    .encode(
        x=alt.X(
            'log_params:Q',
            title='Model size (Log parameters)',
        ),
        y=alt.Y(
            'log_compute:Q',
            title='Training compute (Log FLOPs)',
        ),

        opacity=alt.when(category_selection).then(alt.value(0.9)).otherwise(alt.value(0.2)),

        color=alt.Color(
            'organization_categorization:N',
            title='Organization type',
            scale=alt.Scale(range=range_)
        ),

        size=alt.Size(
            'pub_bin:N',
            title='Publication intensity',
            sort=['Low', 'Medium', 'High'],
            scale=alt.Scale(range=[80, 220]),
        ),

        shape=alt.Shape(
            'export_bin:N',
            title='Export control level',
            sort=['Low', 'Medium', 'High']
        ),

        tooltip=[
            alt.Tooltip('model:N', title='Model'),
            alt.Tooltip('country_first:N', title='Country'),
            alt.Tooltip('organization_categorization:N', title='Org type'),
            alt.Tooltip('year:Q', title='Year'),
            alt.Tooltip('publication_count:Q', title='Publication count'),
            alt.Tooltip('export_controls_sum:Q', title='Export control score'),
            alt.Tooltip('parameters:Q', title='Parameters'),
            alt.Tooltip('training_compute_(flop):Q', title='Training compute (FLOPs)')
        ]
    )
    .properties(
        width=800,
        height=250
    )
)

scatter


# In[28]:


# Base filtered data for selected year
summary_base = (
    alt.Chart(df)
    .add_params(country_param)
    .transform_filter(alt.datum.country_first == country_param)
)

# Boxplot
box = summary_base.mark_boxplot(size=35).encode(
    x=alt.X(
        'export_bin:N',
        title='Export control level',
        sort=['Low', 'Medium', 'High'],
        scale=alt.Scale(domain=['Low', 'Medium', 'High']),
        axis=alt.Axis(labelAngle=0)
    ),
    y=alt.Y(
        'log_compute:Q',
        title='Training compute (Log FLOPs)',
    ),
    color=alt.Color(
        'export_bin:N',
        title='Export control level',
        sort=['Low', 'Medium', 'High'],
        scale=alt.Scale(
            domain=['Low', 'Medium', 'High'],
            range=['#9ECAE1', '#4292C6', '#08519C']
        )
    )
)

# Invisible points for detailed tooltip (model-level info)
tooltip_points = summary_base.mark_circle(size=30, opacity=0).encode(
    x=alt.X('export_bin:N', sort=['Low', 'Medium', 'High']),
    y=alt.Y('log_compute:Q'),
    tooltip=[
        alt.Tooltip('model:N', title='Model'),
        alt.Tooltip('organization_categorization:N', title='Organization'),
        alt.Tooltip('publication_count:Q', title='Publication count'),
        alt.Tooltip('export_controls_sum:Q', title='Export control score'),
        alt.Tooltip('training_compute_(flop):Q', title='Training compute (FLOPs)')
    ]
)

summary_chart = (box + tooltip_points).properties(
    width=400,
    height=260,
    title=alt.Title('Training compute by export-control level', anchor='start')
)

summary_chart


# In[29]:


# Model counts by export level

bars = (
    alt.Chart(df)
    .add_params(country_param).transform_filter(alt.datum.country_first == country_param)
    .mark_bar()
    .encode(
        x=alt.X(
            'export_bin:N',
            title='Export control level',
            sort=['Low', 'Medium', 'High'],
            axis=alt.Axis(labelAngle=0)
        ),
        y=alt.Y(
            'count():Q',
            title='Number of models'
        ),
        color=alt.Color(
            'export_bin:N',
            scale=alt.Scale(
                domain=['Low', 'Medium', 'High'],
                range=['#9ECAE1', '#4292C6', '#08519C']
            )
        ),
        tooltip=[
            alt.Tooltip('export_bin:N', title='Export level'),
            alt.Tooltip('count():Q', title='Models in year')
        ]
    )
    .properties(
        width=350,
        height=280,
        title=alt.Title('Model counts by export level', anchor='start')
    )
)

bars


# In[30]:


# final dashboard

dashboard = (
    scatter & (summary_chart | bars)
).properties(
    title=alt.Title(
        'China produces large models with low export controls and high publication intensity',
        subtitle='Comparatively, the United States produces large models but varies in export controls and publication intensity',
        anchor='start',
        dx=10,
        dy=-10,
        fontSize=16,
        subtitlePadding=6,
        subtitleFontSize=12
    )
).resolve_scale(
    color='independent'
).configure(
    font='Helvetica Neue'
).resolve_legend(
    size='independent'
).add_params(country_param)

dashboard


# In[ ]:




