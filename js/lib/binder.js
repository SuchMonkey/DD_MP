/**
 * Binder.js
 * version: v0.0.3
 * https://github.com/nekman/Binder.js
 * MIT
 * Tue Aug 19 2014 23:18:32 GMT+0200 (CEST)
 * Generated with Require.js and amdclean.
 * Object.observe polyfill from https://github.com/jdarling/Object.observe is included.
 */
(function(global, factory) {
  
  if (typeof exports === 'object') {
    // CommonJS
    exports.Binder = factory();
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define(factory);
  } else {
    // <script>
    global.Binder = factory();
  }
}(this, function() {


var utils_dom = function () {
        
        var valueNodes = {
                INPUT: true,
                TEXTAREA: true,
                OPTION: true
            },
            // Could use Node.ATTRIBUTE_NODE etc. here, but this is not supported 
            // by jsdom.
            // 
            NodeTypes = {
                ELEMENT_NODE: 1,
                ATTRIBUTE_NODE: 2
            }, tagsToReplace = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;'
            }, valueProperty = function (node) {
                // Value node
                if (valueNodes[node.tagName] || node.nodeType === NodeTypes.ATTRIBUTE_NODE) {
                    return 'value';
                }
                // else, just use 'innerHTML'.
                return 'innerHTML';
            };
        return {
            // Gets or sets the value from the current node by
            // checking the nodeType and tagName property.
            val: function (node, value) {
                var oldValue = node[valueProperty(node)];
                if (value === undefined) {
                    return oldValue;
                }
                node[valueProperty(node)] = this.replaceHTML(value);
            },
            //
            // Replace HTML characters:
            // http://stackoverflow.com/questions/5499078/fastest-method-to-escape-html-tags-as-html-entities
            //
            replaceHTML: function (input) {
                if (typeof input !== 'string') {
                    return input;
                }
                return input.replace(/[&<>]/g, function (tag) {
                    return tagsToReplace[tag] || tag;
                });
            },
            // http://stackoverflow.com/questions/3337587/wrapping-a-dom-element-using-pure-javascript
            // Wrap an HTMLElement around each element in an HTMLElement array.
            wrap: function (node, wrapper) {
                var wrapperElement = wrapper || document.createElement('div');
                // Accomplish the same as: node.innerHTML = '<div>' + node.innerHTML + '</div>'
                // but without using 'innerHTML' which removes event listeners.        
                while (node.firstChild) {
                    wrapperElement.appendChild(node.firstChild);
                }
                node.appendChild(wrapperElement);
                return node;
            },
            unwrap: function (node, parentNode) {
                var parent = parentNode || node.parentNode, range = document.createRange();
                range.selectNodeContents(node);
                return parent.appendChild(range.extractContents());
            },
            //
            // Capture the element by:
            // 1.) Save a reference to the parent
            // 2.) Clone the element and remove it
            // 3.) Return a wrapper that can be used for inserting and removing elements from the parent node.
            capture: function (el) {
                var parent = el.parentNode, node = el.cloneNode(true);
                parent.removeChild(el);
                return {
                    node: node,
                    parentNode: parent,
                    insert: function () {
                        var newNode = node.cloneNode(true);
                        parent.appendChild(newNode);
                        return newNode;
                    },
                    remove: function () {
                        parent.removeChild(node);
                    }
                };
            },
            //
            // Gets or sets a attribute on a node.
            // attr(el, 'name'); // get
            // attr(el, 'name', 'value') //set
            ///
            attr: function (node, name, value) {
                if (!node) {
                    return;
                }
                if (value) {
                    node.setAttribute(name, value);
                    return;
                }
                if (typeof node.getAttribute !== 'function') {
                    return;
                }
                return node.getAttribute(name);
            },
            hasAttr: function (node, name) {
                if (!node) {
                    return false;
                }
                if (typeof node.hasAttribute !== 'function') {
                    return false;
                }
                return node.hasAttribute(name);
            },
            isAttr: function (node) {
                return node.nodeType === NodeTypes.ATTRIBUTE_NODE;
            },
            isValueNode: function (node) {
                return valueNodes[node.tagName];
            }
        };
    }();
    //
     // Some functions from underscore.js
     // https://github.com/jashkenas/underscore
var utils_underscore_helpers = function () {
        
        var _ = {};
        _.slice = Array.prototype.slice;
        _.extend = function (obj) {
            _.slice.call(arguments, 1).forEach(function (source) {
                if (source) {
                    for (var prop in source) {
                        obj[prop] = source[prop];
                    }
                }
            });
            return obj;
        };
        return _;
    }();

var parse_textParser = function () {
        
        //
        // Inserts backslash to the bracket(s):
        // bracket: '{{' => '\{\{'
        //
        var insertBackslash = function (bracket) {
            return '\\' + bracket.split('').join('\\');
        };
        function TextParser(options, scopeCache) {
            this.scopes = scopeCache;
            this.settings = options;
            this.leftBracket = this.settings.brackets[0];
            this.rightBracket = this.settings.brackets[1];
            this.matcher = new RegExp(insertBackslash(this.leftBracket) + '(.+?)' + insertBackslash(this.rightBracket), 'g');
        }
        TextParser.prototype = {
            // Simple render function
            render: function (text, model) {
                if (!text) {
                    return '';
                }
                this.getPropertiesFromText(text).forEach(function (propertyName) {
                    var split = propertyName.split('.')[1], value = this.getModelValue(split || propertyName, model);
                    text = text.replace(this.leftBracket, '').replace(propertyName, value).replace(this.rightBracket, '').trim();
                }, this);
                return text;
            },
            // Gets a property value by a propertyName and the model.
            // If the property isn't found in the model, we also try to find
            // the property in another scope, by the property name.
            getModelValue: function (propertyName, model) {
                if (!model) {
                    return;
                }
                if (!(propertyName in model)) {
                    return this.getModelValue(propertyName, this.scopes.findBy(propertyName));
                }
                var value = model[propertyName];
                // If the 'value' is a function, return the result.
                if (typeof value === 'function') {
                    return value.apply(model, []);
                }
                return value;
            },
            //
            // returns truthy if the text contains any {{ brackets }}.
            //
            containsBrackets: function (text) {
                if (!text) {
                    return false;
                }
                return text.trim().match(this.matcher) ? true : false;
            },
            //
            // Finds model properties by searching a text for {{ brackets }},
            // extracts the brackets and returns an array with the model properties.
            //
            getPropertiesFromText: function (text) {
                var matches = text.match(this.matcher);
                if (matches) {
                    return matches.map(function (text) {
                        return this.removeBrackets(text);
                    }, this);
                }
                return [];
            },
            removeBrackets: function (text) {
                return text.replace(this.leftBracket, '', 'g').replace(this.rightBracket, '', 'g').trim();
            }
        };
        return TextParser;
    }();
    // TODO: Look in all scopes...
     // TODO: Remove?
var utils_scopeCache = function () {
        
        function ScopeCache() {
            this.scopes = {};
        }
        ScopeCache.prototype = {
            add: function (scopeName, model) {
                if (this.scopes[scopeName]) {
                    return;
                }
                this.scopes[scopeName] = model;
            },
            find: function (scopeName, propertyName) {
                var scope = this.scopes[scopeName];
                if (scope && propertyName in scope) {
                    return scope;
                }
                // TODO: Look in all scopes...
                return this.scopes.root;
            },
            findBy: function (propertyName) {
                // TODO: fix!
                for (var scopeName in this.scopes) {
                    var scope = this.scopes[scopeName];
                    if (propertyName in scope) {
                        return scope;
                    }
                }
            }
        };
        return ScopeCache;
    }();
    //
     // Attribute binders that can be replaced / extended with
     // user provided binders.
     //
var settings_attributeBindings = {
        // bind-keyup="modelFunction"
        keyup: function (node, model, name) {
            node.addEventListener('keyup', function (e) {
                model[name].apply(model, [
                    e,
                    node,
                    name
                ]);
            });
        },
        // bind-keydown="modelFunction"
        keydown: function (node, model, name) {
            node.addEventListener('keydown', function (e) {
                model[name].apply(model, [
                    e,
                    node,
                    name
                ]);
            });
        },
        // bind-click="modelFunction"
        click: function (node, model, name) {
            node.addEventListener('click', function (e) {
                if (name in model) {
                    model[name].apply(model, [
                        e,
                        node,
                        name
                    ]);
                    return;
                }
                if (model.$parent && name in model.$parent) {
                    model.$parent[name].apply(model, [
                        e,
                        node,
                        name
                    ]);
                }
            });
        },
        // bind-show="booleanModelProperty"
        show: function (node, model, name) {
            node.style.display = model[name] === true ? '' : 'none';
        },
        // bind-disabled="modelProperty"
        disabled: function (node, model, name) {
            node.disabled = model[name];
        },
        // bind-checked="modelProperty"
        checked: function (node, model, name) {
            node.checked = model[name];
            node.addEventListener('change', function () {
                model[name] = node.checked;
            });
        },
        contenteditable: function (node, model, name, dom) {
            node.setAttribute('contenteditable', true);
            node.addEventListener('input', function () {
                model[name] = dom.val(node);
            });
        },
        // bind-selected="modelProperty"
        select: function (node, model, name) {
            node.addEventListener('change', function () {
                model[name] = this.options[this.selectedIndex].value;
            });
        },
        // For <option> elements. Tells if the node should be selected.
        // Example:
        //
        // <option bind-selected="selected"></option>
        selected: function (node, model, name) {
            node.selected = model[name] === true;
        }
    };
    //
     // Connects a model and its properties to DOM-nodes,
     // and can then be used to retreive associated DOM-nodes by
     // calling "get" on a model property name.
     //
     // TODO: Not sure if this approach is needed, should probably be changed/removed.
     //
var connector_nodeConnector = function () {
        
        var dom = utils_dom;
        function NodeConnector(model) {
            this.model = model;
            this.properties = {};
        }
        NodeConnector.prototype.addArray = function (names, node) {
            names.forEach(function (name) {
                if (!this.properties[name]) {
                    this.properties[name] = [];
                }
                if (this.properties[name].indexOf(node) === -1) {
                    this.properties[name].push(node);
                    if (!dom.isValueNode(node)) {
                        return;
                    }
                    [
                        'keyup',
                        'change'
                    ].forEach(function (eventName) {
                        node.addEventListener(eventName, function () {
                            this.handle(name, node);
                        }.bind(this), false);
                    }, this);
                }
            }, this);
            return this;
        };
        NodeConnector.prototype.add = function (name, node) {
            this.addArray([name], node);
            return this;
        };
        NodeConnector.prototype.get = function (name) {
            return this.properties[name] || [];
        };
        NodeConnector.prototype.handle = function (name, node) {
            this.model[name] = dom.val(node);
            return this;
        };
        return NodeConnector;
    }(utils_dom);
    //
     // Needs refactoring + lots of other fixes.
     //
var parse_nodeParser = function () {
        
        var dom = utils_dom, _ = utils_underscore_helpers, TextParser = parse_textParser, ScopeCache = utils_scopeCache, attrBinders = settings_attributeBindings, Connector = connector_nodeConnector;
        return {
            create: function (options, events) {
                var modelScopes = new ScopeCache(), parser = new TextParser(options, modelScopes);
                //
                // Parse a node by:
                //
                // 1.) Check the node for 'repeat' - attribute and parse the repeat nodes
                // 2.) Parse the nodes attributes
                // 3.) Check for child nodes, if found, then call the parseNode recursively
                // 4.) parse the HTML
                //
                var parseNode = function (node, model, repeatNodes, scopeName) {
                        var modelName = scopeName || 'root';
                        modelScopes.add(modelName, model);
                        if (attr(node, 'repeat')) {
                            parseAttributes(node, model, modelName);
                            parseRepeat(dom.wrap(node), model, repeatNodes, modelName);
                            return;
                        }
                        parseAttributes(node, model, modelName);
                        var childNodes = node.children, length = childNodes.length;
                        if (length) {
                            for (var i = 0; i < length; i++) {
                                parseNode(childNodes[i], model, repeatNodes);
                            }
                        } else {
                            parseHTML(node, model, modelName);
                        }
                        // The dom-node can be wrapped in a <div>, 
                        // if so, unwrap the node and delete the wrapper <div>.
                        if (node.isRoot) {
                            dom.unwrap(node);
                            node.parentNode.removeChild(node);
                        }
                    },
                    //
                    // Finds the 'repeat model' in the current model
                    // and calls 'parseNode' function for the element
                    // and the current 'repeat model'.
                    //
                    parseRepeat = function (node, model, repeatNodes) {
                        var child = node.children[0],
                            // <div>
                            property = attr(node, 'repeat') || '', repeatName = property.split(' ')[1], repeatModel = model[repeatName];
                        if (!repeatModel) {
                            console.warn('Could not find any "%s" property to repeat in %o', property, node);
                            return;
                        }
                        var repeatItem = {
                                parent: node,
                                children: []
                            }, capture = dom.capture(child);
                        //Observe the "model.repeatProperty"
                        observe(model, capture, new Connector(model).add(repeatName, capture));
                        //Observe the "repeatProperty"
                        observe(repeatModel, capture, new Connector(repeatModel));
                        // For each item in the array, parse the node.
                        repeatModel.forEach(function (submodel, index) {
                            var el = child.cloneNode(true);
                            // Add reference to the parent model.
                            submodel.$parent = model;
                            submodel.$index = index;
                            // Parse the submodel
                            parseNode(el, submodel, repeatNodes, repeatName);
                            repeatItem.children.push(el);
                        });
                        if (repeatNodes) {
                            repeatNodes.push(repeatItem);
                        }
                    },
                    //
                    // Parses all attributes on a node
                    //
                    parseAttributes = function (node, model, scopeName) {
                        // Look for custom attribute binders
                        for (var binderName in attrBinders) {
                            var name = attr(node, binderName);
                            if (!name) {
                                continue;
                            }
                            if (parser.containsBrackets(name)) {
                                name = parser.removeBrackets(name);
                            }
                            if (name) {
                                // Initialize the binder function.
                                attrBinders[binderName](node, model, name.split('.')[1] || name, dom);
                            }
                        }
                        _.slice.call(node.attributes).filter(function (attr) {
                            if (!attr.value) {
                                return false;
                            }
                            return parser.containsBrackets(attr.value) || new RegExp(options.prefix).test(attr.name);
                        }).forEach(function (attr) {
                            // TODO: is this needed?
                            if (attr.name !== 'value') {
                                // Handle attribute node by submitting the attribute...
                                attr.value = render(attr, attr.value, model, scopeName, node);
                            } else {
                                attr.value = render(node, attr.value, model, scopeName);
                            }
                        });
                    },
                    //
                    // Parses the innerHTML on a node
                    //
                    parseHTML = function (node, model, scopeName) {
                        var text = node.innerHTML;
                        if (parser.containsBrackets(text)) {
                            node.innerHTML = render(node, text, model, scopeName);
                        }
                    },
                    //
                    // Renders the text content in a node. Adds each 
                    // property to the node connector, so that 
                    // model changes also updates any "connected" node 
                    // or attribute node.
                    //
                    render = function (node, text, model, scopeName, attr) {
                        var propertyNames = parser.getPropertiesFromText(text), parsedHTML = parser.render(text, model);
                        var filteredPropertyNames = propertyNames.map(function (prop) {
                                // TODO: Refactor this!
                                // Handle: {{submodel.property}}
                                var split = prop.split('.')[1];
                                if (split && split in model) {
                                    return {
                                        propertyName: split,
                                        model: model
                                    };
                                }
                                // Handle: {{property}}
                                if (prop in model) {
                                    return {
                                        propertyName: prop,
                                        model: model
                                    };
                                }
                                // Handle: parent {{property}} in subscope.
                                // e.g:
                                // <ul bind-repeat="item items">
                                //   <li>{{item.name}} <span>{{parentName}}</span></li>
                                // </ul>
                                var parentModel = modelScopes.find(scopeName, prop);
                                if (parentModel) {
                                    return {
                                        propertyName: prop,
                                        model: parentModel
                                    };
                                }
                            }).filter(function (prop) {
                                return prop !== undefined;
                            });
                        var connector = new Connector(model).addArray(filteredPropertyNames.map(function (item) {
                                return item.propertyName;
                            }), node);
                        filteredPropertyNames.forEach(function (item) {
                            observe(item.model, node, connector, item.propertyName, attr);
                        });
                        // Safely replace the HTML contents. 
                        return dom.replaceHTML(parsedHTML);
                    },
                    //
                    // Get or set the attribute.
                    // Adds the current attribute 'prefix'.
                    //
                    attr = function (node, name, value) {
                        return dom.attr(node, options.prefix + name, value);
                    }, changeMap = {
                        // TODO: Remove event liseners...
                        'delete': function (node, name, model) {
                            var index;
                            if (typeof name === 'number') {
                                index = name;
                            } else {
                                index = parseInt(name, 10);
                            }
                            if (isNaN(index)) {
                                return;
                            }
                            var child = node.parentNode.children[index];
                            if (child) {
                                child.parentNode.removeChild(child);
                            }
                            events.trigger('change', [
                                model,
                                name,
                                node
                            ]);
                        },
                        add: function (node, name, model) {
                            var index = parseInt(name, 10), root = node.insert();
                            root.isRoot = true;
                            if (isNaN(index)) {
                                parseNode(root, model);
                            } else {
                                // TODO: Refactor, and add unit test.
                                var submodel = model[index];
                                submodel.$parent = model;
                                submodel.$index = index;
                                parseNode(root, submodel);
                            }
                            events.trigger('change', [
                                model,
                                name,
                                node
                            ]);
                        },
                        update: function (node, name, model, connector, attrNode, change) {
                            connector.get(name).forEach(function (connectedNode) {
                                var oldValue = change.oldValue, modelValue = parser.getModelValue(name, model);
                                //Handle array assigns
                                if (Array.isArray(modelValue) && Array.isArray(change.oldValue)) {
                                    // Remove existing DOM-nodes associated to the array
                                    change.oldValue.forEach(function (value) {
                                        // Just pass index = 0 here, so that we always remove
                                        // the first element.
                                        changeMap.delete(connectedNode, 0, change.oldValue);
                                    });
                                    // Add new DOM-nodes associated to the array
                                    modelValue.forEach(function (value, index) {
                                        changeMap.add(connectedNode, index, modelValue);
                                    });
                                    // Trigger 'array update' event, when all new DOM-nodes
                                    // is created / removed.
                                    events.trigger('arrayupdate', [
                                        model,
                                        name,
                                        connectedNode
                                    ]);
                                    return;
                                }
                                // Handle normal model property update
                                if (oldValue !== modelValue) {
                                    // if the node is a attribute node, then 
                                    // check to see if the attribute matches a custom attribute binding function.
                                    // If so, execute the function.
                                    if (dom.isAttr(connectedNode)) {
                                        var binderName = connectedNode.name.replace(options.prefix, '');
                                        if (typeof attrBinders[binderName] === 'function') {
                                            attrBinders[binderName](attrNode, model, name, dom);
                                            events.trigger('change', [
                                                model,
                                                name,
                                                connectedNode
                                            ]);
                                            return;
                                        }
                                    }
                                    // No need to change the value in the DOM-node if
                                    // it already have the same value as the model.
                                    if (dom.val(connectedNode) !== modelValue) {
                                        dom.val(connectedNode, modelValue);
                                    }
                                    events.trigger('change', [
                                        model,
                                        name,
                                        connectedNode
                                    ]);
                                }
                            });
                        }
                    },
                    //
                    // Update DOM properties when the model change.
                    //
                    observe = function (model, node, connector, propertyName, attrNode) {
                        var observer = function (changes) {
                            changes.forEach(function (change) {
                                var name = change.name;
                                // If a propertyName is passed to this function, and the change.name
                                // value not matches the submitted propertyName, then return.
                                if (typeof propertyName === 'string' && propertyName !== name) {
                                    return;
                                }
                                // TODO: Pass object instead of lots of arguments...
                                changeMap[change.type](node, name, model, connector, attrNode, change);
                            });
                        };
                        // Use Object.observe to detect model changes.
                        Object.observe(model, observer);
                    };
                return { parseNode: parseNode };
            }
        };
    }(utils_dom, utils_underscore_helpers, parse_textParser, utils_scopeCache, settings_attributeBindings, connector_nodeConnector);

var settings_options = function () {
        
        function getDefaults() {
            return {
                prefix: 'bind-',
                brackets: [
                    '{{',
                    '}}'
                ]
            };
        }
        var settings = getDefaults();
        settings.defaults = getDefaults;
        return settings;
    }();
    // Public API.
     //
     // Written in "brute forced" mode.
     // Needs major refactoring + lots of other fixes.
var binder = function () {
        
        var NodeParser = parse_nodeParser, dom = utils_dom, options = settings_options, attrBinders = settings_attributeBindings, _ = utils_underscore_helpers, events = function (events) {
                return {
                    trigger: function (eventName, args) {
                        if (!events[eventName]) {
                            return;
                        }
                        events[eventName].forEach(function (callback) {
                            // Expect all callbacks to not throw errors...
                            callback.apply(null, args);
                        });
                    }
                };
            };
        var Binder = function (rootNode, model) {
            if (!rootNode) {
                throw new Error('rootNode is required');
            }
            if (!model || typeof model !== 'object') {
                throw new Error('Model is required');
            }
            this.events = {};
            this.repeatNodes = [];
            this.model = model;
            this.rootNode = typeof window.jQuery === 'function' && rootNode instanceof window.jQuery ? rootNode[0] : rootNode;
            this.settings = options.defaults();
            this.eventHandler = events(this.events);
        };
        Binder.prototype = {
            options: function (userOptions) {
                _.extend(this.settings, userOptions);
                return this;
            },
            on: function (eventName, callback) {
                if (!String(eventName).length) {
                    throw new Error('Expected eventname to be a string!');
                }
                if (typeof callback !== 'function') {
                    throw new Error('Expected callback to be a function!');
                }
                if (!this.events[eventName]) {
                    this.events[eventName] = [];
                }
                this.events[eventName].push(callback);
                return this;
            },
            trigger: function (eventName) {
                this.eventHandler.trigger(eventName, [this.model]);
                return this;
            },
            binders: function (binders) {
                _.extend(attrBinders, binders);
                return this;
            },
            bind: function () {
                // Get all child-nodes from the rootNode
                var nodes = this.rootNode.children, len = nodes.length, nodeParser = NodeParser.create(this.settings, this.eventHandler);
                for (var i = 0; i < len; i++) {
                    nodeParser.parseNode(nodes[i], this.model, this.repeatNodes);
                }
                // Handle the repeat nodes
                if (this.repeatNodes.length) {
                    this.repeatNodes.forEach(function (item) {
                        item.children.forEach(function (child) {
                            // The child node is wrapped in a <div>, unwrap before inserting.
                            dom.unwrap(child, item.parent);
                        });
                    });
                }
                // Trigger a complete event when rendering is done.
                // This event can be used to show a hidden template, after the
                // parsing is complete, so that FOUC ('Flash Of Unbound Content')
                // can be prevented.
                this.eventHandler.trigger('complete', [
                    this.rootNode,
                    this.model
                ]);
                return this;
            }
        };
        // Factory method, so that we can create a new instance by calling: Binder(tmpl, model) ...
        var BinderFactory = function (rootNode, model) {
            return new Binder(rootNode, model);
        };
        // Expose underscores extend, metod because its good to have...
        BinderFactory.extend = _.extend;
        // Expose "safe" stringify function. 
        // Removes Binder.js properties '$parent' (which is a circular reference) and $index.
        BinderFactory.stringify = function (model, censor) {
            return JSON.stringify(model, function (key, value) {
                if (key !== '$parent' && key !== '$index') {
                    return value;
                }
            }, censor || 2);
        };
        return BinderFactory;
    }(parse_nodeParser, utils_dom, settings_options, settings_attributeBindings, utils_underscore_helpers);
  return binder;

}));
/*
  Tested against Chromium build with Object.observe and acts EXACTLY the same,
  though Chromium build is MUCH faster

  Trying to stay as close to the spec as possible,
  this is a work in progress, feel free to comment/update

  Specification:
    http://wiki.ecmascript.org/doku.php?id=harmony:observe

  Built using parts of:
    https://github.com/tvcutsem/harmony-reflect/blob/master/examples/observer.js

  Limits so far;
    Built using polling... Will update again with polling/getter&setters to make things better at some point

TODO:
  Add support for Object.prototype.watch -> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/watch
*/
"use strict";
if(!Object.observe){
  (function(extend, global){
    var isCallable = (function(toString){
        var s = toString.call(toString),
            u = typeof u;
        return typeof global.alert === "object" ?
          function(f){
            return s === toString.call(f) || (!!f && typeof f.toString == u && typeof f.valueOf == u && /^\s*\bfunction\b/.test("" + f));
          }:
          function(f){
            return s === toString.call(f);
          }
        ;
    })(extend.prototype.toString);
    // isNode & isElement from http://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
    //Returns true if it is a DOM node
    function isNode(o){
      return (
        typeof Node === "object" ? o instanceof Node :
        o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
      );
    }
    //Returns true if it is a DOM element
    function isElement(o){
      return (
        typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
        o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
    );
    }
    var _isImmediateSupported = (function(){
      return !!global.setImmediate;
    })();
    var _doCheckCallback = (function(){
      if(_isImmediateSupported){
        return function(f){
          return setImmediate(f);
        };
      }else{
        return function(f){
          return setTimeout(f, 10);
        };
      }
    })();
    var _clearCheckCallback = (function(){
      if(_isImmediateSupported){
        return function(id){
          clearImmediate(id);
        };
      }else{
        return function(id){
          clearTimeout(id);
        };
      }
    })();
    var isNumeric=function(n){
      return !isNaN(parseFloat(n)) && isFinite(n);
    };
    var sameValue = function(x, y){
      if(x===y){
        return x !== 0 || 1 / x === 1 / y;
      }
      return x !== x && y !== y;
    };
    var isAccessorDescriptor = function(desc){
      if (typeof(desc) === 'undefined'){
        return false;
      }
      return ('get' in desc || 'set' in desc);
    };
    var isDataDescriptor = function(desc){
      if (typeof(desc) === 'undefined'){
        return false;
      }
      return ('value' in desc || 'writable' in desc);
    };
    
    var validateArguments = function(O, callback, accept){
      if(typeof(O)!=='object'){
        // Throw Error
        throw new TypeError("Object.observeObject called on non-object");
      }
      if(isCallable(callback)===false){
        // Throw Error
        throw new TypeError("Object.observeObject: Expecting function");
      }
      if(Object.isFrozen(callback)===true){
        // Throw Error
        throw new TypeError("Object.observeObject: Expecting unfrozen function");
      }
      if (accept !== undefined) {
        if (!Array.isArray(accept)) {
          throw new TypeError("Object.observeObject: Expecting acceptList in the form of an array");
        }
      }
    };

    var Observer = (function(){
      var wraped = [];
      var Observer = function(O, callback, accept){
        validateArguments(O, callback, accept);
        if (!accept) {
          accept = ["add", "update", "delete", "reconfigure", "setPrototype", "preventExtensions"];
        }
        Object.getNotifier(O).addListener(callback, accept);
        if(wraped.indexOf(O)===-1){
          wraped.push(O);
        }else{
          Object.getNotifier(O)._checkPropertyListing();
        }
      };

      Observer.prototype.deliverChangeRecords = function(O){
        Object.getNotifier(O).deliverChangeRecords();
      };

      wraped.lastScanned = 0;
      var f = (function(wrapped){
              return function(){
                var i = 0, l = wrapped.length, startTime = new Date(), takingTooLong=false;
                for(i=wrapped.lastScanned; (i<l)&&(!takingTooLong); i++){
                  Object.getNotifier(wrapped[i])._checkPropertyListing();
                  takingTooLong=((new Date())-startTime)>100; // make sure we don't take more than 100 milliseconds to scan all objects
                }
                wrapped.lastScanned=i<l?i:0; // reset wrapped so we can make sure that we pick things back up
                _doCheckCallback(f);
              };
            })(wraped);
      _doCheckCallback(f);
      return Observer;
    })();

    var Notifier = function(watching){
    var _listeners = [], _acceptLists = [], _updates = [], _updater = false, properties = [], values = [];
      var self = this;
      Object.defineProperty(self, '_watching', {
                  enumerable: true,
                  get: (function(watched){
                    return function(){
                      return watched;
                    };
                  })(watching)
                });
      var wrapProperty = function(object, prop){
        var propType = typeof(object[prop]), descriptor = Object.getOwnPropertyDescriptor(object, prop);
        if((prop==='getNotifier')||isAccessorDescriptor(descriptor)||(!descriptor.enumerable)){
          return false;
        }
        if((object instanceof Array)&&isNumeric(prop)){
          var idx = properties.length;
          properties[idx] = prop;
          values[idx] = object[prop];
          return true;
        }
        (function(idx, prop){
          properties[idx] = prop;
          values[idx] = object[prop];
          Object.defineProperty(object, prop, {
            get: function(){
              return values[idx];
            },
            set: function(value){
              if(!sameValue(values[idx], value)){
                Object.getNotifier(object).queueUpdate(object, prop, 'update', values[idx]);
                values[idx] = value;
              }
            }
          });
        })(properties.length, prop);
        return true;
      };
      self._checkPropertyListing = function(dontQueueUpdates){
        var object = self._watching, keys = Object.keys(object), i=0, l=keys.length;
        var newKeys = [], oldKeys = properties.slice(0), updates = [];
        var prop, queueUpdates = !dontQueueUpdates, propType, value, idx, aLength;

        if(object instanceof Array){
          aLength = object.length;
        }

        for(i=0; i<l; i++){
          prop = keys[i];
          value = object[prop];
          propType = typeof(value);
          if((idx = properties.indexOf(prop))===-1){
            if(wrapProperty(object, prop)&&queueUpdates){
              self.queueUpdate(object, prop, 'add', null, object[prop]);
            }
          }else{
            if((object instanceof Array)&&(isNumeric(prop))){
              if(values[idx] !== value){
                if(queueUpdates){
                  self.queueUpdate(object, prop, 'update', values[idx], value);
                }
                values[idx] = value;
              }
            }
            oldKeys.splice(oldKeys.indexOf(prop), 1);
          }
        }

        if(object instanceof Array && object.length !== aLength){
          if(queueUpdates){
            self.queueUpdate(object, 'length', 'update', aLength, object);
          }
        }

        if(queueUpdates){
          l = oldKeys.length;
          for(i=0; i<l; i++){
            idx = properties.indexOf(oldKeys[i]);
            self.queueUpdate(object, oldKeys[i], 'delete', values[idx]);
            properties.splice(idx,1);
            values.splice(idx,1);
          };
        }
      };
      self.addListener = function(callback, accept){
        var idx = _listeners.indexOf(callback);
        if(idx===-1){
          _listeners.push(callback);
          _acceptLists.push(accept);
        }
        else {
          _acceptLists[idx] = accept;
        }
      };
      self.removeListener = function(callback){
        var idx = _listeners.indexOf(callback);
        if(idx>-1){
          _listeners.splice(idx, 1);
          _acceptLists.splice(idx, 1);
        }
      };
      self.listeners = function(){
        return _listeners;
      };
      self.queueUpdate = function(what, prop, type, was){
        this.queueUpdates([{
          type: type,
          object: what,
          name: prop,
          oldValue: was
        }]);
      };
      self.queueUpdates = function(updates){
        var self = this, i = 0, l = updates.length||0, update;
        for(i=0; i<l; i++){
          update = updates[i];
          _updates.push(update);
        }
        if(_updater){
          _clearCheckCallback(_updater);
        }
        _updater = _doCheckCallback(function(){
          _updater = false;
          self.deliverChangeRecords();
        });
      };
      self.deliverChangeRecords = function(){
        var i = 0, l = _listeners.length,
            //keepRunning = true, removed as it seems the actual implementation doesn't do this
            // In response to BUG #5
            retval;
        for(i=0; i<l; i++){
          if(_listeners[i]){
            var currentUpdates;
            if (_acceptLists[i]) {
              currentUpdates = [];
              for (var j = 0, updatesLength = _updates.length; j < updatesLength; j++) {
                if (_acceptLists[i].indexOf(_updates[j].type) !== -1) {
                  currentUpdates.push(_updates[j]);
                }
              }
            }
            else {
              currentUpdates = _updates;
            }
            if (currentUpdates.length) {
              if(_listeners[i]===console.log){
                console.log(currentUpdates);
              }else{
                _listeners[i](currentUpdates);
              }
            }
          }
        }
        /*
        for(i=0; i<l&&keepRunning; i++){
          if(typeof(_listeners[i])==='function'){
            if(_listeners[i]===console.log){
              console.log(_updates);
            }else{
              retval = _listeners[i](_updates);
              if(typeof(retval) === 'boolean'){
                keepRunning = retval;
              }
            }
          }
        }
        */
        _updates=[];
      };
      self.notify = function(changeRecord) {
        if (typeof changeRecord !== "object" || typeof changeRecord.type !== "string") {
          throw new TypeError("Invalid changeRecord with non-string 'type' property");
        }
        changeRecord.object = watching;
        self.queueUpdates([changeRecord]);
      };
      self._checkPropertyListing(true);
    };

    var _notifiers=[], _indexes=[];
    extend.getNotifier = function(O){
    var idx = _indexes.indexOf(O), notifier = idx>-1?_notifiers[idx]:false;
      if(!notifier){
        idx = _indexes.length;
        _indexes[idx] = O;
        notifier = _notifiers[idx] = new Notifier(O);
      }
      return notifier;
    };
    extend.observe = function(O, callback, accept){
      // For Bug 4, can't observe DOM elements tested against canry implementation and matches
      if(!isElement(O)){
        return new Observer(O, callback, accept);
      }
    };
    extend.unobserve = function(O, callback){
      validateArguments(O, callback);
      var idx = _indexes.indexOf(O),
          notifier = idx>-1?_notifiers[idx]:false;
      if (!notifier){
        return;
      }
      notifier.removeListener(callback);
      if (notifier.listeners().length === 0){
        _indexes.splice(idx, 1);
        _notifiers.splice(idx, 1);
      }
    };
  })(Object, this);
}