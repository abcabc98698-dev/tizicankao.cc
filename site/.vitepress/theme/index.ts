import type { Theme } from 'vitepress';
import Layout from './Layout.vue';
import './style.css';

// 全量引入设计规范组件
import SiteHeader from './components/SiteHeader.vue';
import MoreTopicsDropdown from './components/MoreTopicsDropdown.vue';
import MobileNav from './components/MobileNav.vue';
import PagefindSearch from './components/PagefindSearch.vue';
import TaskFinder from './components/TaskFinder.vue';
import AnswerFirst from './components/AnswerFirst.vue';
import TopicMatrix from './components/TopicMatrix.vue';
import ComparisonTable from './components/ComparisonTable.vue';
import DecisionTree from './components/DecisionTree.vue';
import VersionScope from './components/VersionScope.vue';
import SourceList from './components/SourceList.vue';
import ClientCard from './components/ClientCard.vue';
import TrialCard from './components/TrialCard.vue';
import MainSiteCTA from './components/MainSiteCTA.vue';
import Disclosure from './components/Disclosure.vue';
import Breadcrumbs from './components/Breadcrumbs.vue';
import RelatedTasks from './components/RelatedTasks.vue';

const theme: Theme = {
  Layout,
  enhanceApp({ app }) {
    app.component('SiteHeader', SiteHeader);
    app.component('MoreTopicsDropdown', MoreTopicsDropdown);
    app.component('MobileNav', MobileNav);
    app.component('PagefindSearch', PagefindSearch);
    app.component('TaskFinder', TaskFinder);
    app.component('AnswerFirst', AnswerFirst);
    app.component('TopicMatrix', TopicMatrix);
    app.component('ComparisonTable', ComparisonTable);
    app.component('DecisionTree', DecisionTree);
    app.component('VersionScope', VersionScope);
    app.component('SourceList', SourceList);
    app.component('ClientCard', ClientCard);
    app.component('TrialCard', TrialCard);
    app.component('MainSiteCTA', MainSiteCTA);
    app.component('Disclosure', Disclosure);
    app.component('Breadcrumbs', Breadcrumbs);
    app.component('RelatedTasks', RelatedTasks);
  }
};

export default theme;
