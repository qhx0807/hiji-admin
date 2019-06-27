import SearchPreview from './SearchPreview.vue'
import SearchEditor from './SearchEditor.vue'
import combine from '../../base/combineComponents'
const designType = 'search'
const designDescription = '搜索栏'

const Search = combine(SearchPreview, SearchEditor, designType, designDescription)

Search.defaultValue = {
  fixed: true,
  bgcolor: '#ffffff',
  bgimg: '',
  scan: true,
  placeholder: '搜索...',
  color: '#888888',
  prefix: true
}

export default Search
