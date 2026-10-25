import test from 'node:test';
import assert from 'node:assert/strict';
import {hashPassword,verifyPassword} from '../lib/password.ts';
test('password hashes use distinct salts and verify only the correct password',()=>{
 const a=hashPassword('correct password');const b=hashPassword('correct password');
 assert.notEqual(a,b);assert.equal(verifyPassword('correct password',a),true);assert.equal(verifyPassword('wrong password',a),false);
});
test('malformed persisted hashes are rejected as a whole',()=>{
 const a=hashPassword('password');
 for(const bad of [a+':extra',a+'zz','',':',a.split(':')[1]])assert.equal(verifyPassword('password',bad),false);
});
