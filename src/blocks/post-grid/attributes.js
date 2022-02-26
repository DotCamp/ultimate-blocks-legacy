const attributes = {
	wrapAlignment: {
		type: "string",
		default: "",
	},
	checkPostImage: {
		type: "boolean",
		default: true,
	},
	postImageWidth: {
		type: "number",
		default: 600,
	},
	preservePostImageAspectRatio: {
		type: "boolean",
		default: true,
	},
	postImageHeight: {
		type: "number",
		default: 400,
	},
	checkPostAuthor: {
		type: "boolean",
		default: true,
	},
	checkPostDate: {
		type: "boolean",
		default: true,
	},
	checkPostExcerpt: {
		type: "boolean",
		default: true,
	},
	excerptLength: {
		type: "number",
		default: 55,
	},
	checkPostLink: {
		type: "bolean",
		default: true,
	},
	readMoreText: {
		type: "string",
		default: "Continue Reading",
	},
	amountPosts: {
		type: "number",
		default: 6,
	},
	postLayout: {
		type: "string",
		default: "grid",
	},
	columns: {
		type: "number",
		default: 2,
	},
	authorArray: {
		type: "array",
		default: [],
	},
	categories: {
		type: "string",
		default: "",
	},
	categoryArray: {
		type: "array",
		default: [],
	},
	tagArray: {
		type: "array",
		default: [],
	},
	offset: {
		type: "number",
		default: 0,
	},
	order: {
		type: "string",
		default: "desc",
	},
	orderBy: {
		type: "string",
		default: "date",
	},
	checkPostTitle: {
		type: "boolean",
		default: true,
	},
	postTitleTag: {
		type: "string",
		default: "h4",
	},
};

export default attributes;
