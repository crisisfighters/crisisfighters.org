exports.testV1 = function(event, context, callback) {
    callback(null, {
    statusCode: 200,
    body: "Hello, World\n" + JSON.stringify(event)
    });
}
