# email-renderer
Simple email renderer with html and text mode
## Examples
```javascript
	var serrv = require("./api/services/SelfService");
	var users = [
		{
			name: {
				first: 'John',
				last: 'Smith'
			},
		},
		{
			name: {
				first: 'Frank',
				last: 'Kafka'
			},
		}
	];
	// Async code
	serrv.compileTemplate(process.cwd() + "/templates/", "foo_", users[0], true, function(err, res) {
		if(err) {
			return console.log(err);
		}
		console.log(res);
	});
	// Sync code
	var templates = users.map(function (user) {
		return serrv.compileTemplateSync(process.cwd() + "/templates/", "foo_", user, true);
	});	// Return array
	templates.forEach(function(tmpl) {
		console.log(tmpl);
	});