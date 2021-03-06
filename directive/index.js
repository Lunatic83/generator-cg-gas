'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var path = require('path');
var cgUtils = require('../utils.js');
var chalk = require('chalk');
var _ = require('underscore');
var fs = require('fs');

_.str = require('underscore.string');
_.mixin(_.str.exports());

var DirectiveGenerator = module.exports = function DirectiveGenerator(args, options, config) {

    yeoman.generators.NamedBase.apply(this, arguments);

};

util.inherits(DirectiveGenerator, yeoman.generators.NamedBase);

DirectiveGenerator.prototype.askFor = function askFor() {
    var cb = this.async();

    if(this.options.directiveoptions===undefined){
        var prompts = [{
            type:'confirm',
            name: 'needpartial',
            message: 'Does this directive need an external html file (i.e. partial)?',
            default: true
        }];

        this.prompt(prompts, function (props) {
            this.needpartial = props.needpartial;
            cgUtils.askForModuleAndDir('directive',this,this.needpartial,cb);
        }.bind(this));
    }else{
        this.needpartial = this.options.directiveoptions.needpartial;
        cgUtils.askForModuleAndDir('directive',this,this.needpartial,cb);
    }        

};

DirectiveGenerator.prototype.files = function files() {

    var configName = 'directiveSimpleTemplates';
    var defaultDir = 'templates/simple';
    if (this.needpartial) {
        configName = 'directiveComplexTemplates';
        defaultDir = 'templates/complex';
    }

    this.htmlPath = path.join(this.dir,this.name + '.html').replace(/\\/g,'/');;

    if(this.options.directiveoptions===undefined){
        cgUtils.processTemplates(this.name,this.dir,'directive',this,defaultDir,configName,this.module);
    }else{
        cgUtils.processTemplates(this.name,this.dir,'directive',this,defaultDir,null,this.module);
    }

};