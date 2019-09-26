const attributes = {
       blockID: {
           type: 'string',
           default: ''
       },
       displayPostImage: {
           type: 'boolean',
           default: 'true'
       },
       displayPostAuthor: {
           type: 'boolean',
           default: 'true'
       },
       displayPostDate: {
           type: 'boolean',
           default: 'true'
       },
       displayPostExcerpt: {
           type: 'boolean',
           default: 'true'
       },
       excerptLength: {
           type: 'number',
           default: 55
       },
       displayPostLink: {
           type: 'bolean',
           default: 'true',
       },
       readMoreText: {
           type: 'string',
           default: 'Continue Reading'
       },
       postsShow: {
           type: 'number',
           default: 10,
       },
       postLayout: {
           type: 'string',
           default: 'grid'
       },
       columns: {
           type: 'number',
           default: 2
       },
       categories: {
           type: 'string',
           value: ''
       },
       postType: {
           type: 'string',
           default: 'post'
       },
       offset: {
           type: 'number',
           value: 0
       },
       order: {
           type: 'string',
           value: 'desc'
       },
       orderBy: {
           type: 'string',
           value: 'date'
       }
};

export default attributes;