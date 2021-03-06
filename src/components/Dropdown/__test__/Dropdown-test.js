/**
 * Created by AshZhang on 15/11/9.
 */


import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import { Dropdown } from '../../index';


describe('Dropdown', () => {
  let dropDownData;

  beforeEach(() => {
    dropDownData = {
      toggle: {
        name: 'exchangeable',
        text: '我能兑换'
      },
      filters: [
        {
          name: 'sort',
          text: '排序',
          list: [
            {
              name: 'count',
              text: '兑换量优先'
            },
            {
              name: 'pointsAtoZ',
              text: '积分从低到高'
            }
          ]
        },
        {
          name: 'category',
          text: '分类',
          list: [
            {
              name: 'virtual',
              text: '虚拟礼品'
            },
            {
              name: 'physical',
              text: '实物礼品'
            }
          ]
        }
      ]
    };
  });

  it('renders a dropdown', () => {
    const instance = TestUtils.renderIntoDocument(
            <Dropdown {...dropDownData} />
          ),
          dropDownNode = ReactDOM.findDOMNode(instance),
          titles = dropDownNode.querySelectorAll('.dropdown-title'),
          toggle = dropDownNode.querySelector('.check-btn');

    expect(dropDownNode.classList.contains('dropdown')).toBeTruthy();
    expect(titles.length).toEqual(2);
    expect(titles[0].textContent).toEqual(dropDownData.filters[0].text);
    expect(toggle.textContent).toEqual(dropDownData.toggle.text);
    expect(document.body.firstElementChild.classList.contains('dropdown-mounted')).toBeTruthy();
  });

  it('toggle checked & active filters', () => {
    dropDownData.toggle.checked = true;
    dropDownData.filters[0].list[0].active = true;

    const instance = TestUtils.renderIntoDocument(
            <Dropdown {...dropDownData} />
          ),
          dropDownNode = ReactDOM.findDOMNode(instance),
          titles = dropDownNode.querySelectorAll('.dropdown-title'),
          toggle = dropDownNode.querySelector('.check-btn');

    expect(toggle.classList.contains('check-btn-checked')).toBeTruthy();
    expect(titles[0].classList.contains('active')).toBeTruthy();
    expect(titles[1].classList.contains('active')).toBeFalsy();
  });

  it('toggle check button', () => {
    const spy = jasmine.createSpy(),
          instance = TestUtils.renderIntoDocument(
            <Dropdown {...dropDownData} onFilter={spy} />
          ),
          dropDownNode = ReactDOM.findDOMNode(instance),
          toggle = dropDownNode.querySelector('.check-btn');

    TestUtils.Simulate.touchTap(toggle);
    expect(toggle.classList.contains('check-btn-checked')).toBeTruthy();
    expect(spy.calls.count()).toEqual(1);
    expect(spy.calls.mostRecent().args[0].exchangeable).toBeTruthy();

    TestUtils.Simulate.touchTap(toggle);
    expect(toggle.classList.contains('check-btn-checked')).toBeFalsy();
    expect(spy.calls.count()).toEqual(2);
    expect(spy.calls.mostRecent().args[0].exchangeable).toBeFalsy();
  });

  it('open / close a list', () => {
    const instance = TestUtils.renderIntoDocument(
            <Dropdown {...dropDownData} />
          ),
          dropDownNode = ReactDOM.findDOMNode(instance),
          titles = dropDownNode.querySelectorAll('.dropdown-title');

    TestUtils.Simulate.touchTap(titles[0]);
    expect(titles[0].classList.contains('opened')).toBeTruthy();
    expect(dropDownNode.querySelectorAll('.dropdown-item').length).toEqual(2);
    expect(document.querySelector('.mask')).not.toBeNull();

    TestUtils.Simulate.touchTap(titles[0]);
    expect(titles[0].classList.contains('opened')).toBeFalsy();
    expect(dropDownNode.querySelectorAll('.dropdown-item').length).toEqual(2);
    //expect(document.querySelector('.mask')).toBeNull();
  });

  it('toggle an item', () => {
    const spy = jasmine.createSpy(),
          instance = TestUtils.renderIntoDocument(
            <Dropdown {...dropDownData} onFilter={spy} />
          ),
          dropDownNode = ReactDOM.findDOMNode(instance),
          titles = dropDownNode.querySelectorAll('.dropdown-title');

    let items;

    TestUtils.Simulate.touchTap(titles[0]);
    items = dropDownNode.querySelectorAll('.dropdown-item');
    TestUtils.Simulate.touchTap(items[0]);
    expect(titles[0].classList.contains('active')).toBeTruthy();
    expect(titles[0].textContent).toEqual(dropDownData.filters[0].list[0].text);
    expect(spy.calls.count()).toEqual(1);
    expect(spy.calls.mostRecent().args[0].sort).toEqual('count');

    TestUtils.Simulate.touchTap(titles[1]);
    items = dropDownNode.querySelectorAll('.dropdown-item');
    TestUtils.Simulate.touchTap(items[0]);
    expect(titles[1].classList.contains('active')).toBeTruthy();
    expect(titles[1].textContent).toEqual(dropDownData.filters[1].list[0].text);
    expect(spy.calls.count()).toEqual(2);
    expect(spy.calls.mostRecent().args[0].category).toEqual('virtual');
  });

  it('depth: 2', () => {
    const data = {
      filters: [
        {
          name: 'category',
          text: '分类',
          depth: 2,
          list: [
            {
              name: 'all',
              text: '全部'
            },
            {
              name: 'physical',
              text: '实物礼品'
            },
            {
              name: 'discount',
              text: '淘宝优惠',
              list: [
                {
                  name: 'all',
                  text: '全部'
                },
                {
                  name: 'free-shipping-card',
                  text: '包邮卡'
                }
              ]
            }
          ]
        }
      ]
    },
      spy = jasmine.createSpy(),
      instance = TestUtils.renderIntoDocument(
        <Dropdown {...data} onFilter={spy}/>
      ),
      dropDownNode = ReactDOM.findDOMNode(instance),
      titles = dropDownNode.querySelectorAll('.dropdown-title');

    let menus, items;

    TestUtils.Simulate.touchTap(titles[0]);
    menus = dropDownNode.querySelectorAll('.dropdown-menu');
    TestUtils.Simulate.touchTap(menus[0]);
    expect(titles[0].classList.contains('active')).toBeTruthy();
    expect(titles[0].textContent).toEqual('分类');
    expect(spy.calls.count()).toEqual(1);
    expect(spy.calls.mostRecent().args[0].category).toEqual(['all']);

    TestUtils.Simulate.touchTap(titles[0]);
    TestUtils.Simulate.touchTap(menus[1]);
    expect(titles[0].classList.contains('active')).toBeTruthy();
    expect(titles[0].textContent).toEqual('实物礼品');
    expect(spy.calls.count()).toEqual(2);
    expect(spy.calls.mostRecent().args[0].category).toEqual(['physical']);

    TestUtils.Simulate.touchTap(titles[0]);
    TestUtils.Simulate.touchTap(menus[2]);
    expect(titles[0].textContent).toEqual('实物礼品');
    expect(spy.calls.count()).toEqual(2);
    items = dropDownNode.querySelectorAll('.dropdown-item');
    TestUtils.Simulate.touchTap(items[0]);
    expect(titles[0].textContent).toEqual('淘宝优惠');
    expect(spy.calls.count()).toEqual(3);
    expect(spy.calls.mostRecent().args[0].category).toEqual(['discount', 'all']);

    TestUtils.Simulate.touchTap(titles[0]);
    TestUtils.Simulate.touchTap(items[1]);
    expect(titles[0].textContent).toEqual('包邮卡');
    expect(spy.calls.count()).toEqual(4);
    expect(spy.calls.mostRecent().args[0].category).toEqual(['discount', 'free-shipping-card']);
  });
});
