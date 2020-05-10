const attributes = {
	wrapAlignment: {
		type: "string",
		default: "",
	},
	checkPostImage: {
		type: "boolean",
		default: true,
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
	categories: {
		type: "string",
		value: "",
	},
	postType: {
		type: "string",
		default: "post",
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
	postTitleTag: {
		type: "string",
		default: "h2",
	},
};

export default attributes;
