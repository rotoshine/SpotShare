import minimist from 'minimist';
const argv = minimist(process.argv.slice(2));
const isDevMode = argv.mode !== 'production';

let React;
if(isDevMode){
  React = require('react');
}else{
  React = require('react/dist/react.min.js');
}

export default React;
