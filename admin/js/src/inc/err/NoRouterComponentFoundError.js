function NoRouterComponentFoundError() {
	this.name = 'NoRouterComponentFoundError';
	this.message =
		'No router component found within RouterProvider. Please make sure you have passed Router component as a child of RouterProvider.';
}

NoRouterComponentFoundError.prototype = Error.prototype;

export default NoRouterComponentFoundError;
