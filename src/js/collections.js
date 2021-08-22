import '../scss/collections.scss';

import Header from '../components/header/index';
import NoContentTip from '../components/no_content_tip/index';
import NewsItem from '../components/news_item/index';
import Zepto from 'zepto-webpack'
import FastClick from 'fastclick'
import tools from '../utils/tools';
import { config } from '../utils/config'

const header = new Header(),
      noContentTip = new NoContentTip(),
      newsItem = new NewsItem();

const App = ($) => {
  const { collections_key, collection_target } = config,
        operateClassName = 'operate'

  const $app = $('#app'),
        $list = $app.children('.list')

  const collections = JSON.parse(localStorage.getItem(collections_key) || '[]')

  const movePos = {
    x: 0,
    y: 0
  }

  let t = null;

  const init = () => {
    tools.resetFontSize();
    FastClick && FastClick.attach(document.body);
    render().then(bindEvent);
  }

  const render = () => {
    return new Promise((resolve, reject) => {
      _renderHeader();

      if (!collections || Object.keys(collections).length === 0) {
        _renderNoContentTip('没有收藏新闻');
      } else {
        _renderList(collections);
      }

      resolve();
    });
  }

  const bindEvent = () => {
    $list.on('click', '.news-item', toDetailPage)
         .on('touchstart', '.news-item', touchStart)
         .on('touchmove', '.news-item', touchMove)
  }

  const _renderHeader = () => {
  	$app.append(header.tpl({
  		title: '我的收藏',
  		showLeftIcon: true,
  		showRightIcon: false
  	}));
  }

  const _renderNoContentTip = (text) => {
    $app.append(noContentTip.tpl(text));
  }

  const _renderList = (data) => {
    $list.append(newsItem.tpl(_arrangeDatas(data)));
    tools.thumbShow($('.news-thumb'));
  }

  function toDetailPage (e) {
    const $tar = $(e.target);
    if ($tar.hasClass(operateClassName)) {
      const $newsItem = $tar.parent().parent(),
            uniquekey = $newsItem.data('uniquekey');

      $newsItem.addClass('remove');
      t = setTimeout(() => {
        $newsItem.remove();
        removeCollection(uniquekey);
      }, 500);
      return;
    }

    const $this = $(this),
          url = $this.attr('data-url'),
          uniquekey = $this.attr('data-uniquekey');

    localStorage.setItem(collection_target, JSON.stringify(collections[uniquekey]));
    window.location.href = `detail.html?news_url=${url}&uniquekey=${uniquekey}`;
  }

  function _arrangeDatas (data) {
    let _arr = [];

    for (let key in data) {
      _arr.push(data[key]);
    }

    return _arr;
  }

  function touchStart(e) {
    const { pageX, pageY } = e.touches[0];

    movePos.x = pageX;
    movePos.y = pageY;
  }

  function touchMove(e) {
    const { pageX, pageY } = e.touches[0];

    const gapX = movePos.x - pageX,
          isOffsetYValid = Math.abs(movePos.y - pageY) <= 30

    // Y轴方向偏移
    if (!isOffsetYValid) {
      return;
    }

    // 左滑
    if (gapX >= 100) {
      $(this).find('.main').addClass(operateClassName);
      return;
    }

    if(gapX <= -100) {
      resetNewsItemState();
    }
  }

  // 恢复状态
  function resetNewsItemState() {
    $list.find('.main').removeClass(operateClassName);
    movePos.x = 0;
    movePos.y = 0;
  }

  // 删除该收藏
  function removeCollection(key) {
    collections[key]
    && delete collections[key]
    && localStorage.setItem(collections_key, JSON.stringify(collections))

    if (!collections || Object.keys(collections).length === 0) {
      _renderNoContentTip('没有收藏新闻');
    }
  }

  init();
}

App(Zepto);
