#!/usr/bin/env python
# coding: utf-8

# # View 1
# Which countries are the top 10 contributors to global AI model releases, and how are they geographically distributed?

# In[1]:


import pandas as pd
import altair as alt
from vega_datasets import data
import geopandas as gpd

alt.data_transformers.disable_max_rows()


# In[2]:


df = pd.read_csv('../../../data/processed/models_final.csv')
df.head()


# In[3]:


# Feature selection + wrangling 

geo_cols = [
    'model',
    'country_first',
    'year',
    'era',
    'organization_categorization',
    'model_accessibility'
]

df_geo_raw = df[geo_cols].copy()
df_geo_raw = df_geo_raw.dropna(subset=['country_first', 'year'])

df_geo_raw['year'] = pd.to_numeric(df_geo_raw['year'], errors='coerce')
df_geo_raw = df_geo_raw.dropna(subset=['year'])

df_geo_raw['country_first'] = (
    df_geo_raw['country_first']
    .astype(str)
    .str.strip()
)

df_geo_raw['country_name'] = df_geo_raw['country_first'].replace({
    'USA': 'United States of America',
    'US': 'United States of America',
    'United States': 'United States of America',
    'UK': 'United Kingdom',
})

# Drop multinational - this provides more clarity to the countries that are actually producing models and unremoves unclear countries
df_geo_raw = df_geo_raw[df_geo_raw['country_name'] != 'Multinational']

df_geo_total = (
    df_geo_raw
    .groupby('country_name', as_index=False)
    .agg(n_models=('model', 'count'))
)

# Identify top-10 countries by total count
top_countries = (
    df_geo_total
    .sort_values('n_models', ascending=False)
    .head(10)['country_name']
    .tolist()
)

df_geo_total['is_top10'] = df_geo_total['country_name'].isin(top_countries)

df_geo_total.head()


# ## View

# In[4]:


# View 1 – Geographic distribution of model releases

url = "https://naciscdn.org/naturalearth/110m/cultural/ne_110m_admin_0_countries.zip"
gdf_world = gpd.read_file(url)[["NAME", "geometry"]].copy()

gdf_merged = gdf_world.merge(
    df_geo_total,
    left_on='NAME',
    right_on="country_name",
    how="left"
)

# Selection

country_sel = alt.selection_point(
    fields=["country_name"],
    clear="true"
)

# Bar chart: Top 10 countries
bar_chart = (
    alt.Chart(df_geo_total[df_geo_total["is_top10"]])
    .mark_bar()
    .encode(
        x=alt.X("n_models:Q", title="Total models released"),
        y=alt.Y("country_name:N", sort="-x", title="Country"),
        color=alt.condition(
            country_sel,
            alt.value("#4C78A8"),
            alt.value("#d3d3d3")
        ),
        tooltip=[
            alt.Tooltip("country_name:N", title="Country"),
            alt.Tooltip("n_models:Q", title="# Models (total)")
        ]
    )
    .add_params(country_sel)
    .properties(
        width=400,
        height=250,
        title=alt.Title(
            'Top 10 countries in totals models released', 
            anchor='start', dx=10, dy=-10, fontSize=14, subtitlePadding=6, subtitleFontSize=12
        )
    )
)

# Map Chart
map_chart = (
    alt.Chart(gdf_merged)
    .mark_geoshape(stroke="white")
    .add_params(country_sel)
    .encode(
        color=alt.condition(
            country_sel,
            alt.Color(
                "n_models:Q",
                title="Total models released",
                scale=alt.Scale(type="log", scheme="blues")
            ),
            alt.value("#f0f0f0") 
        ),
        tooltip=[
            alt.Tooltip("country_name:N", title="Country"),
            alt.Tooltip("n_models:Q", title="# Models (total)")
        ]
    )
    .project(type="equalEarth")
    .properties(
        width=700,
        height=350,
        title=alt.Title(
            'The United States and China lead global AI model development', 
            subtitle='The United Kingdom, Canada, and South Korea make up the remainder of the top 5 countries in total models released.',
            anchor='start', dx=10, dy=-10, fontSize=16, subtitlePadding=6, subtitleFontSize=12
        )
    )
)

# Concatenate
geo_dashboard = alt.hconcat(
    map_chart,
    bar_chart
).resolve_legend(color='independent')

geo_dashboard


# In[ ]:




