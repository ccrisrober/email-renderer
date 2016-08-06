////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 														EXAMPLES
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//	var serrv = require("./api/services/SelfService");
//	// Async code
//	serrv.compileTemplate(process.cwd() + "/templates/", "foo_", users[0], true, function(err, res) {
//		if(err) {
//			return console.log(err);
//		}
//		console.log(res);
//	});
//	// Sync code
//	var templates = users.map(function (user) {
//		return serrv.compileTemplateSync(process.cwd() + "/templates/", "foo_", user, true);
//	});	// Return array
//	templates.forEach(function(tmpl) {
//		console.log(tmpl);
//	});
//

var ejs = require("ejs");
var async = require("async");

function compile(file, data, next) {
	var absoluteTemplatePath = file + '.ejs';
	ejs.renderFile(absoluteTemplatePath, data, function(err, compiledTemplate) {
		if (err) {
			//throw new Error('Problem compiling template: ' + err);
			return(err, null);
		}
		//console.log('[INFO] COMPILED TEMPLATE: ', compiledTemplate)
		next(null, compiledTemplate);
	});
};
function compilateAll(path_, file, data, text_html, callback) {
	var views = [];
	views.push(function(callback) {
	        compile(path_ + file + "html", data, function(err, data) {
				callback(err, data);
			});
	    });
	if(text_html === true) {
		views.push(
		    function(callback) {
		        compile(path_ + file + "text", data, function(err, data) {
					callback(err, data);
				});
		    });
	}
	async.parallel(views,
		function(err, results) {
			var ret = {
				html: results[0]
			};
			if(results.length === 2) {
				ret.text = results[1];
			}
			callback(err, ret);
		});
};

var deasync = require('deasync');

function compilateAllSync(path_, file, data, text_html) {
    var sync = true;
    var dd = null;
    compilateAll(path_, file, data, text_html, function(err, d) {
    	dd = d;
    	sync = false;
    });
    while(sync) {deasync.sleep(100);}
    return dd;
};

/**
 * @param {string} path_ : Absolute path directory
 * @param {string} file : File prefix (without html/text)
 * @param {object} data: Data to inject in template
 * @param {boolean} text_html: Generate HTML and text templates (false: Only HTML, true: HTML and text)
 * @param {function} next: Callback (err, repsonse)
 */
exports.compileTemplate = function(path_, file, data, text_html, next) {
	return compilateAll(path_, file, data, text_html, next);
};

/**
 * @param {string} path_ : Absolute path directory
 * @param {string} file : File prefix (without html/text)
 * @param {object} data: Data to inject in template
 * @param {boolean} text_html: Generate HTML and text templates (false: Only HTML, true: HTML and text)
 */
exports.compileTemplateSync = function(path_, file, data, text_html) {
	return compilateAllSync(path_, file, data, text_html);
};