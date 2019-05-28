const express = require('express');
const fetch = require('node-fetch');
const chai = require('chai');
const deepEqualInAnyOrder = require('deep-equal-in-any-order');
const sinonChai = require('sinon-chai');
chai.use(deepEqualInAnyOrder);
chai.use(sinonChai);
const wait = require('@lets/wait');
const abuser = require('abuser');
const sinon = require('sinon');

Object.assign(
	global,
	chai,
	fetch,
	sinon,
	{
		express,
		fetch,
		wait,
		abuser,
		sinon,
	}
);

// require('dont-look-up')('./packages');

process.on('unhandledRejection', error => { throw error; });
