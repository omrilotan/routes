const express = require('express');
const fetch = require('node-fetch');
const chai = require('chai');
const deepEqualInAnyOrder = require('deep-equal-in-any-order');
const wait = require('@lets/wait');
chai.use(deepEqualInAnyOrder);
const abuser = require('abuser');

Object.assign(
	global,
	chai,
	fetch,
	{
		express,
		fetch,
		wait,
		abuser,
	}
);

require('dont-look-up')('./packages');

process.on('unhandledRejection', error => { throw error; });
