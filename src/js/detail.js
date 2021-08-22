import '../scss/detail.scss';

import Header from '../components/header/index';
import NewsFrame from '../components/news_frame/index';
import Collector from '../components/collector/index';
import Zepto from 'zepto-webpack'
import FastClick from 'fastclick'
import tools from '../utils/tools';
import { config } from '../utils/config'

const header = new Header(),
      newsFrame = new NewsFrame(),
      collector = new Collector();

const App = ($) => {
  const { collection_target, collections_key } = config;
  const $app = $('#app'),
        $frameWrapper = $app.children('.frame-wrapper'),
        target = JSON.parse(localStorage.getItem(collection_target)),
        newsUrl = tools.getUrlQueryValue('news_url') || target.url,
        uniquekey = tools.getUrlQueryValue('uniquekey') || target.uniquekey;

  let collections = JSON.parse(localStorage.getItem(config.collections_key)) || {},
      collected = Boolean(collections[uniquekey]);


  const init = () => {
    tools.resetFontSize();
    FastClick && FastClick.attach(document.body);
    render().then(bindEvent);
  }

  const render = () => {
    return new Promise((resolve, reject) => {
      _renderHeader();
      _renderFrame(newsUrl);
      _renderCollector(collected);
      resolve();
    });
  }

  const bindEvent = () => {
    $('.collector').on('click', newsCollect);
  }

  const _renderHeader = () => {
  	$app.append(header.tpl({
  		title: '新闻详情',
  		showLeftIcon: true,
  		showRightIcon: false
  	}));
  }

  const _renderFrame = (newsUrl) => {
    $frameWrapper.append(newsFrame.tpl(newsUrl));
  }

  const _renderCollector = (collected) => {
    $app.append(collector.tpl(collected));
  }

  function newsCollect () {
    if (collections[uniquekey]) {
      delete collections[uniquekey];
      collected = false;
    } else {
      collections[uniquekey] = JSON.parse(localStorage.getItem(collection_target));
      collected = true;
    }

    localStorage.setItem(collections_key, JSON.stringify(collections));
    collector.changeCollector(collected);
  }

  init();
}

App(Zepto);
