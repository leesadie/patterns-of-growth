#!/usr/bin/env python
# coding: utf-8

# # View 2
# 
# How does model accessibility (open weights, API-only, closed) vary across the top 10 model-producing countries, and how does training compute differ across these accessibility levels?

# In[1]:


import pandas as pd
import numpy as np
import altair as alt


# In[2]:


df = pd.read_csv('../../../data/processed/models_final.csv')
df.head()


# In[3]:


# Feature Selection + wrangling

df_view2 = df[['model_accessibility',
               'organization_categorization',
               'country_first',
               'year',
               'era',
               'training_compute_(flop)']].copy()

df_view2 = df_view2.dropna(subset=['organization_categorization'])

# Aggregate organization type to - academia, industry, government, multiple
multiple = {
    'Academia, Industry',
    'Academia, Industry, Government',
    'Academia, Government',
    'Industry, Government'
}

def group_multiple(x):
    if x in multiple:
        return "Multiple"
    elif x == "Academia":
        return "Academia"
    elif x == "Industry":
        return "Industry"
    elif x == "Government":
        return "Government"
    else:
        return "Other" # fallback

df_view2['organization_categorization'] = df_view2['organization_categorization'].apply(group_multiple)

df_view2['training_compute_(flop)'] = pd.to_numeric(df_view2['training_compute_(flop)'], errors='coerce')
df_view2['log_compute'] = np.log10(df_view2['training_compute_(flop)'])

df_view2['organization_categorization'] = df_view2['organization_categorization'].astype(str).str.strip().replace({'nan': np.nan})
df_view2['model_accessibility'] = df_view2['model_accessibility'].astype(str).str.strip().replace({'nan': np.nan})

df_view2['country_first'] = df_view2['country_first'].fillna('Unknown')
df_view2['year'] = pd.to_numeric(df_view2['year'], errors='coerce')

df_view2 = df_view2.dropna(subset=['organization_categorization', 'model_accessibility', 'year', 'training_compute_(flop)'])
df_view2['year'] = df_view2['year'].astype(int)

# Restrict to top 10 countries by number of models
top_countries = (
    df_view2['country_first']
    .value_counts()
    .nlargest(10)
    .index
    .tolist()
)
df_view2 = df_view2[df_view2['country_first'].isin(top_countries)].copy()

# Year slider
year_min = int(df_view2['year'].min())
year_max = int(df_view2['year'].max())

year_slider = alt.binding_range(min=year_min, max=year_max, step=1, name='Max year: ')
year_param = alt.param('year_cutoff', bind=year_slider, value=year_max)

# Base Chart (filter by year only)
base = (
    alt.Chart(df_view2)
    .add_params(year_param)
    .transform_filter(alt.datum.year <= year_param)
)


# In[4]:


df_view2.head()


# In[5]:


org_sort = (df_view2['organization_categorization'].value_counts().index.tolist())

log_min = float(df_view2['log_compute'].min())
log_max = float(df_view2['log_compute'].max())

accessibility_domain = sorted(
    df_view2['model_accessibility'].dropna().unique().tolist()
)

accessibility_scale = alt.Scale(
    domain=accessibility_domain,
    scheme='blueorange'
)


# In[6]:


# Stacked Bar Chart

stacked = (
    base
    .mark_bar()
    .encode(
        x=alt.X(
            'organization_categorization:N',
            title='Organization type',
            sort=org_sort,
            axis=alt.Axis(labelAngle=0)
        ),
        y=alt.Y(
            'count():Q',
            stack='normalize',
            axis=alt.Axis(title='Share of models', format='%'),
            scale=alt.Scale(domain=[0, 1])
        ),
        color=alt.Color(
        'model_accessibility:N',
        title='Model accessibility',
        scale=accessibility_scale
    ),
        tooltip=[
            alt.Tooltip('organization_categorization:N', title='Organization type'),
            alt.Tooltip('model_accessibility:N', title='Accessibility'),
            alt.Tooltip('count():Q', title='Number of models'),
            alt.Tooltip('country_first:N', title='Country'),
        ]
    )
    .properties(
        width=450,
        height=280,
        title=alt.Title(
            'Accessibility by organization type',
            subtitle='100% stacked bars show the share of open weights, API-only, and closed models.',
            anchor='start',
            dx=5,
            dy=-10,
            fontSize=14,
            subtitleFontSize=11,
            subtitlePadding=4,
        )
    )
)


# In[7]:


# Heatmap

heat = (
    base
    .transform_filter('isValid(datum.log_compute)')
    .transform_aggregate(
        mean_log_compute='mean(log_compute)',
        groupby=['organization_categorization', 'country_first']
    )
    .mark_rect()
    .encode(
        x=alt.X(
            'organization_categorization:N',
            title='Organization type',
            sort=org_sort,
            axis=alt.Axis(labelAngle=0)
        ),
        y=alt.Y(
            'country_first:N',
            title='Top 10 countries',
            sort='-x'
        ),
        color=alt.Color(
            'mean_log_compute:Q',
            title='Mean log compute',
            scale=alt.Scale(domain=[log_min, log_max], scheme='blues')
        ),
        tooltip=[
            alt.Tooltip('organization_categorization:N', title='Organization type'),
            alt.Tooltip('country_first:N', title='Country'),
            alt.Tooltip('mean_log_compute:Q', title='Mean log10 compute', format='.2f'),
        ]
    )
    .properties(
        width=450,
        height=260,
        title=alt.Title(
            'Training compute by organization and country',
            subtitle='Color encodes mean log10 training compute (FLOPs) for each org x country (top 10 countries).',
            anchor='start',
            dx=5,
            dy=-10,
            fontSize=14,
            subtitleFontSize=11,
            subtitlePadding=4,
        )
    )
)

heat_labels = (
    heat
    .mark_text(baseline='middle', fontSize=10)
    .encode(
        text=alt.Text('mean_log_compute:Q', format='.1f'),
        color=alt.condition(
            alt.datum.mean_log_compute > (log_min + log_max) / 2,
            alt.value('white'),
            alt.value('black')
        )
    )
)

heat

heatmap = heat + heat_labels


# In[8]:


# final combined dashboard

view2_final = (heatmap | stacked).properties(
    title=alt.Title(
        'Mixed organization types (Multiple) provide the most unrestricted open weight models',
        subtitle='Industry follows in unrestricted open weights and leads in restricted open weights',
        anchor='start',
        dx=10,
        dy=-10,
        fontSize=16,
        subtitleFontSize=12,
        subtitlePadding=6,
    )
).resolve_legend(color='independent')

view2_final


# In[ ]:




