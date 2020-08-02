import _ from 'lodash';
import React from 'react';
import Wallpapers from './wallpapers';
import SearchBar from './search_bar';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.wallpaperSubReddit =
      'wallpapers+wallpaper+wideScreenWallpaper+hdWallpaper';
    this.portraitSubReddit =
      'mobileWallpapers+amolEdBackgrounds+verticalWallpapers';
    this.memesSubReddit = 'memes+dankMemes+memeEconomy+AniMemes';
    this.subRedditArray = [
      'wallpaper',
      'wallpapers',
      'wideScreenWallpaper',
      'hdWallpaper',
      'memes',
      'dankMemes',
      'memeEconomy',
      'AniMemes',
      'mobileWallpapers',
      'amolEdBackgrounds',
      'verticalWallpapers',
    ];
    this.url = 'https://www.reddit.com/r/';
    this.sorts = ['hot', 'new', 'top', 'controversial', 'rising'];
  }

  state = {
    currentSubReddit: 'wallpapers+wallpaper+wideScreenWallpaper+hdWallpaper',
    sort: 'hot',
    files: [],
    after: null,
    before: null,
    page: 1,
  };

  componentDidMount() {
    this.changeSubReddit(this.state.currentSubReddit);
  }

  nextPage = () => {
    fetch(
      this.url +
        this.state.currentSubReddit +
        '/' +
        this.state.sort +
        '.json?count=' +
        this.state.page * 25 +
        '&after=' +
        this.state.after
    )
      .then((res) => res.json())
      .then((data) => {
        this.setState(() => ({
          files: data.data.children,
          after: data.data.after,
          before: data.data.before,
          page: this.state.page + 1,
        }));
        window.scrollTo(0, 0);
      })
      .catch(console.log);
  };

  prevPage = () => {
    fetch(
      this.url +
        this.state.currentSubReddit +
        '/' +
        this.state.sort +
        '.json?count=' +
        ((this.state.page - 1) * 25 - 1) +
        '&before=' +
        this.state.before
    )
      .then((res) => res.json())
      .then((data) => {
        window.scrollTo(0, 0);
        let newState = {
          files: data.data.children,
          after: data.data.after,
          before: data.data.before,
        };
        if (this.state.page > 1) {
          newState.page = this.state.page - 1;
        }
        this.setState(newState);
      })
      .catch(console.log);
  };

  changeSubReddit(sub) {
    /*
     * Empty the files so we will show 'Loading...'
     * Reset page to 1
     */
    this.setState({
      files: [],
      currentSubReddit: sub,
      page: 1,
    });
    fetch(this.url + sub + '/' + this.state.sort + '.json')
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          files: data.data.children,
          after: data.data.after,
          before: data.data.before,
        });
        window.scrollTo(0, 0);
      })
      .catch(console.log);
  }

  changeSort(sort) {
    /*
     * Empty the files so we will show 'Loading...'
     * Reset page to 1
     */
    this.setState({
      files: [],
      sort: sort,
      page: 1,
    });
    fetch(this.url + this.state.currentSubReddit + '/' + sort + '.json')
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          files: data.data.children,
          after: data.data.after,
          before: data.data.before,
        });
        window.scrollTo(0, 0);
      })
      .catch(console.log);
  }

  searchSubReddit(subReddit) {
    if (subReddit.length !== 0) {
      this.changeSubReddit(subReddit);
    } else {
      this.changeSubReddit(this.wallpaperSubReddit);
    }
  }

  render() {
    const searchSubReddit = _.debounce((term) => {
      this.searchSubReddit(term);
    }, 600);
    let contentJSX;
    if (this.state.files.length > 0) {
      let pagingJSX;
      const buttonNext = (
        <button
          className='btn btn-primary'
          type='submit'
          onClick={this.nextPage}
        >
          Next
        </button>
      );
      const buttonPrev = (
        <button
          className='btn btn-secondary'
          type='submit'
          onClick={this.prevPage}
        >
          Previous
        </button>
      );
      if (this.state.after === null && this.state.before !== null) {
        // last page
        pagingJSX = <div>{buttonPrev}</div>;
      } else if (this.state.before === null && this.state.after !== null) {
        // first page
        pagingJSX = <div>{buttonNext}</div>;
      } else if (this.state.before !== null && this.state.after !== null) {
        // in between pages
        pagingJSX = (
          <div>
            {buttonPrev}{' '}
            <span className='p-3 text-black-50'>Page {this.state.page}</span>{' '}
            {buttonNext}
          </div>
        );
      } else {
        pagingJSX = <div>No Posts found.</div>;
      }
      contentJSX = (
        <div className='m-2'>
          <Wallpapers files={this.state.files} />
          <br />
          <div className='center-block m-2'>{pagingJSX}</div>
        </div>
      );
    } else {
      contentJSX = (
        <div className='p-2'>
          <center>Loading...</center>
        </div>
      );
    }

    let currentSubReddit;
    if (this.state.currentSubReddit === this.wallpaperSubReddit) {
      currentSubReddit = 'Landscape Wallpapers';
    } else if (this.state.currentSubReddit === this.portraitSubReddit) {
      currentSubReddit = 'Portrait Wallpapers';
    } else if (this.state.currentSubReddit === this.memesSubReddit) {
      currentSubReddit = 'Memes SubReddit';
    } else {
      currentSubReddit = 'r/' + this.state.currentSubReddit;
    }

    return (
      <div className='container'>
        <br />
        <div>
          <div className='dropdown m-2' style={{ display: 'inline' }}>
            <button
              className='btn btn-primary'
              type='button'
              id='dropdownMenuButton'
              data-toggle='dropdown'
              aria-haspopup='true'
              aria-expanded='false'
            >
              {currentSubReddit} &nbsp;
            </button>
            <div className='dropdown-menu' aria-labelledby='dropdownMenuButton'>
              <a
                className='dropdown-item'
                href='#subChange'
                onClick={() => this.changeSubReddit(this.wallpaperSubReddit)}
              >
                Landscape Wallpapers
              </a>
              <a
                className='dropdown-item'
                href='#subChange'
                onClick={() => this.changeSubReddit(this.portraitSubReddit)}
              >
                Portrait Wallpapers
              </a>
              <a
                className='dropdown-item'
                href='#subChange'
                onClick={() => this.changeSubReddit(this.memesSubReddit)}
              >
                Memes SubReddit
              </a>
              {this.subRedditArray.map((subReddit, index) => (
                <a
                  className='dropdown-item'
                  key={index}
                  href='#subChange'
                  onClick={() => this.changeSubReddit(subReddit)}
                >
                  {subReddit}
                </a>
              ))}
            </div>
          </div>
          <div className='dropdown m-2' style={{ display: 'inline' }}>
            <button
              className='btn btn-outline-secondary dropdown-toggle'
              type='button'
              id='dropdownMenuButton'
              data-toggle='dropdown'
              aria-haspopup='true'
              aria-expanded='false'
            >
              {this.state.sort} &nbsp;
            </button>
            <div className='dropdown-menu' aria-labelledby='dropdownMenuButton'>
              {this.sorts.map((sort, index) => (
                <a
                  className='dropdown-item'
                  key={index}
                  href='#subChange'
                  onClick={() => this.changeSort(sort)}
                >
                  {sort}
                </a>
              ))}
            </div>
          </div>
          <div className='m-3'></div>
          <SearchBar onSearchTermChange={(term) => searchSubReddit(term)} />
        </div>
        <br />
        {contentJSX}
        <br />
        <footer>
          <center>
            <p>
              Please find more project
              <a href='https://schand143.github.io/My-Portfolio/'>
                {' '}
                Portfolio{' '}
              </a>
              .<br />
            </p>
          </center>
        </footer>
      </div>
    );
  }
}

export default App;
