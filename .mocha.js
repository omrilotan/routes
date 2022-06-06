const express = require('express');
const chai = require('chai');
const wait = require('@lets/wait');
const abuser = require('abuser');
const sinon = require('sinon');
[
	'deep-equal-in-any-order',
	'sinon-chai',
	'chai-as-promised',
].forEach(
	plugin => chai.use(require(plugin))
)

Object.assign(
	global,
	chai,
	sinon,
	{
		express,
		wait,
		abuser,
		sinon,
	}
);

process.on('unhandledRejection', error => { console.error(error); process.exit(1); });
process.on('uncaughtException', (error, origin) => { console.error(error, origin); process.exit(1); });
