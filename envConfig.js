const target = process.env.target || 'github';

const envConfig = {
  'github': {
    'base': '/'
  },
  "i996": {
    base: '/blogs/',
  },
  'dev': {
    'base': '/'
  }
}

export default envConfig[target];