import Prismic from 'prismic-javascript'

const REPOSITORY = process.env.PRISMIC_REPOSITORY_NAME
const REF_API_URL = `https://${REPOSITORY}.prismic.io/api/v2`
const GRAPHQL_API_URL = `https://${REPOSITORY}.prismic.io/graphql`
// export const API_URL = 'https://your-repo-name.cdn.prismic.io/api/v2'
export const API_TOKEN = process.env.PRISMIC_API_TOKEN
export const API_LOCALE = process.env.PRISMIC_REPOSITORY_LOCALE

export const PrismicClient = Prismic.client(REF_API_URL, {
  accessToken: API_TOKEN,
})

async function fetchAPI(query, { previewData, variables } = {}) {
  const prismicAPI = await PrismicClient.getApi()
  const res = await fetch(
    `${GRAPHQL_API_URL}?query=${query}&variables=${JSON.stringify(variables)}`,
    {
      headers: {
        'Prismic-Ref': previewData?.ref || prismicAPI.masterRef.ref,
        'Content-Type': 'application/json',
        'Accept-Language': API_LOCALE,
        Authorization: `Token ${API_TOKEN}`,
      },
    }
  )
  if (res.status !== 200) {
    console.log(await res.text())
    throw new Error('Failed to fetch API')
  }

  const json = await res.json()
  if (json.errors) {
    console.error(json.errors)
    throw new Error('Failed to fetch API')
  }
  return json.data
}

export async function getAllPostsWithSlug() {
  const data = await fetchAPI(`
    {
      allPosts {
        edges {
          node {
            _meta {
              uid
            }
          }
        }
      }
    }
  `)
  return data?.allPosts?.edges
}

export async function getAllPostsForHome(previewData) {
  const data = await fetchAPI(
    `
    query {
      allPosts(sortBy: date_DESC) {
        edges {
          node {
            date
            title
            content
            coverimage
            excerpt
            author {
              ...on Author {
                name
                picture
              }
            }
            _meta {
              uid
            }
          }
        }
      }
    }
  `,
    { previewData }
  )

  return data.allPosts.edges
}

export async function getAllPostsForProducts(previewData) {
  const data = await fetchAPI(
    `
    query {
      allPost_products(sortBy: product_date_DESC){
         edges {
           node {
             product_date
             product_title
             product_image
             _meta{
               tags
               uid
             }
             product_price
             product_link {
               __typename
              ... on _ExternalLink{
                url
              }
            }
           }
         }
     	 }
     }
  `,
    { previewData }
  )

  return data.allPost_products.edges
}

// INDEX PAGE
export async function indexPageQuery(previewData) {
  const data = await fetchAPI(
    `
    query {
      allIndex_pags{
        edges{
          node{
            body{
              __typename
              ... on Index_pagBodyProduct_card{
                fields{
                  product_card_date
                  product_card_image
                  product_card_title
                  product_card_price
                  product_card_link {
                    ... on _ExternalLink{
                      url
                    }
                  }
                }
              }
              ... on Index_pagBodyProduct_page_specific_link{
                fields{
                  product_page_title
                  product_page_link
                  product_image
                }
              }
              ... on Index_pagBodyPage_title{
                fields{
                  page_title
                }
              }
              ... on Index_pagBodyOnline_advert{
                fields{
                  advert_image_desktop
                  advert_image_mobile
                  advert_link{
                    ... on _ExternalLink{
                      url
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    `,
    { previewData }
  )
  return data.allIndex_pags.edges
}

export async function getPostAndMorePosts(slug, previewData) {
  const data = await fetchAPI(
    `
  query PostBySlug($slug: String!, $lang: String!) {
    post(uid: $slug, lang: $lang) {
      title
      content
      date
      coverimage
      author {
        ...on Author {
          name
          picture
        }
      }
      _meta {
        uid
      }
    }

   morePosts: allPosts(sortBy: date_DESC, first: 3) {
      edges {
        node {
          title
          content
          date
          coverimage
          excerpt
          author{
            ...on Author {
              name
              picture
            }
          }
          _meta {
            uid
          }
        }
      }
    }
  }
  `,
    {
      previewData,
      variables: {
        slug,
        lang: API_LOCALE,
      },
    }
  )

  data.morePosts = data.morePosts.edges
    .filter(({ node }) => node._meta.uid !== slug)
    .slice(0, 2)

  return data
}
