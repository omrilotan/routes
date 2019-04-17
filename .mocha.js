const express = require('express');
const fetch = require('node-fetch');
const chai = require('chai');
const deepEqualInAnyOrder = require('deep-equal-in-any-order');
chai.use(deepEqualInAnyOrder);

Object.assign(
	global,
	chai,
	fetch,
	{
		express,
		fetch,
	}
);

require('dont-look-up')('./packages');

process.on('unhandledRejection', error => { throw error; });
