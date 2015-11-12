/**
 * Created by AshZhang on 15/11/12.
 */


'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import { PlusMinus } from '../../src/components/index';


describe('PlusMinus', () => {
  const setting = {
    value: 10,
    min: 9,
    max: 11
  };

  it('renders a plus-minus', () => {
    const instance = TestUtils.renderIntoDocument(
            <PlusMinus {...setting} />
          ),
          plusMinus = ReactDOM.findDOMNode(instance);

    expect(plusMinus.classList.contains('plus-minus')).toBeTruthy();
    expect(plusMinus.querySelector('input').value).toEqual('10');
    expect(plusMinus.querySelectorAll('button').length).toEqual(2);
  });

  it('plus', () => {
    const spy = jasmine.createSpy(),
          instance  = TestUtils.renderIntoDocument(
            <PlusMinus {...setting} onChange={spy} />
          ),
          plusMinus = ReactDOM.findDOMNode(instance),
          plus = plusMinus.querySelectorAll('.plus-minus-btn')[1],
          spy2 = jasmine.createSpy(),
          instance2  = TestUtils.renderIntoDocument(
            <PlusMinus {...setting} value={11} onChange={spy2} />
          ),
          plusMinus2 = ReactDOM.findDOMNode(instance2),
          plus2 = plusMinus2.querySelectorAll('.plus-minus-btn')[1];

    TestUtils.Simulate.touchTap(plus);
    expect(spy.calls.count()).toEqual(1);
    expect(spy.calls.mostRecent().args[0]).toEqual(11);

    TestUtils.Simulate.touchTap(plus2);
    expect(spy2.calls.count()).toEqual(0);
  });

  it('minus', () => {
    const spy = jasmine.createSpy(),
          instance  = TestUtils.renderIntoDocument(
            <PlusMinus {...setting} onChange={spy} />
          ),
          plusMinus = ReactDOM.findDOMNode(instance),
          plus = plusMinus.querySelectorAll('.plus-minus-btn')[0],
          spy2 = jasmine.createSpy(),
          instance2  = TestUtils.renderIntoDocument(
            <PlusMinus {...setting} value={9} onChange={spy2} />
          ),
          plusMinus2 = ReactDOM.findDOMNode(instance2),
          plus2 = plusMinus2.querySelectorAll('.plus-minus-btn')[0];

    TestUtils.Simulate.touchTap(plus);
    expect(spy.calls.count()).toEqual(1);
    expect(spy.calls.mostRecent().args[0]).toEqual(9);

    TestUtils.Simulate.touchTap(plus2);
    expect(spy2.calls.count()).toEqual(0);
  });
});