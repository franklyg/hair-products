require('dotenv').config()

module.exports = {
  env: {
    PRISMIC_API_TOKEN:
      process.env.CMS_PRISMIC_API_TOKEN,
    PRISMIC_REPOSITORY_NAME:
      process.env.PRISMIC_REPOSITORY_NAME,
    PRISMIC_REPOSITORY_LOCALE:
      process.env.REPOSITORY_LOCALE || 'en-us',
  }
}
