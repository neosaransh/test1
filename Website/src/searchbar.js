import React from 'react';
import Autosuggest from 'react-autosuggest';
import * as AutosuggestHighlightMatch from 'autosuggest-highlight/match';
import * as AutosuggestHighlightParse from 'autosuggest-highlight/parse';
import ApiRequest from './ApiRequest.js';

class Search extends React.Component {
    componentDidMount() {
        new ApiRequest('GET', '/clientlist').send((res, people) => {
            if (res.status == 200) {
                this.setState({people});
            } else if (res.status == 401 || res.status == 403) {
                console.log('authentication error');
            }
        });
    }

    constructor() {
        super();

        this.state = {
            value: '',
            suggestions: [],
            people: [],
            selection: ''
        };

        this.renderSuggestion = (suggestion, {query}) => {
            const suggestionText = `${suggestion.name}`;
            const matches = AutosuggestHighlightMatch(suggestionText, query);
            const parts = AutosuggestHighlightParse(suggestionText, matches);

            return (
                <span className='suggestion-content '
                      style={{backgroundImage: `url(${suggestion.profileimg || 'http://s3.amazonaws.com/37assets/svn/765-default-avatar.png'})`}}>
              <span className="name">
                {
                    parts.map((part, index) => {
                        const className = part.highlight ? 'highlight' : null;

                        return (
                            <span className={className} key={index}>{part.text}</span>
                        );
                    })
                }
              </span>
            </span>
            )
        };

        //updates search results as user types
        this.onChange = (event, {newValue, method}) => {
            this.setState({
                value: newValue
            });
        };

        function sortByKey(array, key) {
            return array.sort(function(a, b) {
                var x = a[key]; var y = b[key];
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
        }

        //filtering search results
        this.onSuggestionsFetchRequested = ({value}) => {
            const regexp = new RegExp("^(?:.*[^a-zA-Z]|)" + value, "i");
            if (value) {
                this.setState({
                    suggestions: sortByKey(this.state.people.filter(person => regexp.test(person.name)),"name")
                });
            } else {
                this.setState({
                    suggestions: sortByKey(this.state.people.filter(person => person.lastinteraction),"lastinteraction").reverse().slice(0,3)
                });
            }
        };
        //clears results
        this.onSuggestionsClearRequested = () => {
            this.setState({suggestions: []});
        };

        //redirects to profile when clicked
        this.onSuggestionSelected = (event, {suggestion, suggestionValue, sectionIndex, method}) => {
            window.location = "/profile/" + suggestion.id;
        };

    }

    render() {
        const {value, suggestions} = this.state;
        const inputProps = {
            placeholder: "Search...",
            value,
            onChange: this.onChange,
            spellCheck: false
        };

        return (
            <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={person => person.name}
                renderSuggestion={this.renderSuggestion}
                inputProps={inputProps}
                onSuggestionSelected={this.onSuggestionSelected}
                focusInputOnSuggestionClick={false}
                alwaysRenderSuggestions={true}
            />
        );
    }
}

export default Search;
