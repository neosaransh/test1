# Medimo Labs Provider Website
The provider-side website was created primarily by [Anish Mato](https://github.com/AnishMahto), [Jacob Danovitch](https://github.com/jacobdanovitch), [Nicholas Mertin](https://github.com/magikm18), and [Victor Kobayashi](https://github.com/Kobai). 

The following documents the build of the provider-side website and its associated components.

## Table of Contents

- [Purpose of this site](#purpose-of-this-site)
- [APIRequest](#apirequest)
- [App](#app)
- [App.test](#app.test)
- [changeBackgroundBasedOnLogin](#changebackgroundbasedonlogin)
- [ClientList](#clientlist)
- [Contact](#contact)
- [Drawer](#drawer)
- [Footer](#footer)
- [GlobalState](#globalstate)
- [Header](#header)
- [index](#index)
- [Login](#login)
- [Main](#main)
- [NotFound](#notfound)
- [OverTimeQueryBuilder](#overtimequerybuilder)
- [PasswordReset](#passwordreset)
- [Profile](#profile)
- [QueryGraph](#querygraph)
- [QuerySaver](#querysaver)
- [registerServiceWorker](#registerserviceworker)
- [SavedQueryLoader](#savedqueryloader)
- [ScreenDataProvider](#screendataprovider)
- [Screens](#screens)
- [searchbar](#searchbar)
- [SignUp](#signup)
- [SinglePatientQueryBuilder](#singlepatientquerybuilder)
- [StatsHelper](#statshelper)

## Purpose of this site

Medimo Labs Inc. is a physician-founded company aiming to leverage modern technologies to increase the efficiency, reach, and impact of mental healthcare. This website was created for healthcare providers to interact with and monitor the health of their patients, with features such as client profiles for fast and accurate summaries of patients, custom data visualization for effectively analyzing health trends, and instant messaging to quickly assist with immediate issues and decrease appointment volume. 

## APIRequest

## App

App.js renders the global header and the body of the page (derived from (#Main)).

#### Associated CSS: `App.css`

## App.test

## changeBackgroundBasedOnLogin

## ClientList

## Contact

## Drawer

Drawer.js creates a Drawer object built with the [react-motion-drawer](https://github.com/stoeffel/react-motion-drawer) project.

#### Associated CSS: `Drawer.css`

#### `Drawer` Props

`className='drawer'`: calls helper CSS class <br>
`noTouchOpen={true}'`: Don't change; essential to preventing drawer from being easily undocked by user. <br>
`noTouchClose={true}'`: Don't change; essential to preventing drawer from being easily undocked by user. <br>
`style={style}`: calls variable style with base drawer CSS <br>
`width={800}`: Makes drawer wide enough to contain user variable selections <br>
`panTolerance={10000}`: Don't change; essential to preventing drawer from being easily undocked by user. <br>
`open={open}`: sets open state (default false) <br>
`onChange={open => this.setState({open})}`: Changes open state when interacted with <br>

#### `Drawer` Miscellaneous

`closebtn`: button for exiting drawer when opened

## Footer

## GlobalState

## Header

## index

## Login

## Main

## NotFound

## OverTimeQueryBuilder

#### Associated CSS: `querybuilder.css`

#### `List` Props

`lockAxis='y'`: Restricts user to dragging rows vertically  <br>
`ŀockToContainerEdges={true}`: Prevents user from dragging rows outside list container <br>
`helperClass={sortableHelper}`: Don't change; sets z-index such that rows stay on top of drawer when dragging <br>

## PasswordReset

## Profile

Patient profiles containing user information and a custom data visualization.

#### Associated CSS: `Profile.css`

#### `Profile` Miscellaneous:

`clientProfile`: Contains patient name, profile picture, and condition summary <br>
`clientInfoTable`: Contains patient basic info, medication, goals, etc. in table form <br>
`clientGraph`: Custom data visualization (see: (#QueryGraph))

## QueryGraph

Building custom data visualization with data from Parse Server using [react-js-2](https://github.com/jerairrest/react-chartjs-2).

## QuerySaver

## registerServiceWorker

## SavedQueryLoader

## ScreenDataProvider

## Screens

## searchbar

Building site-wide patient search functionality using [react-autosuggest](https://github.com/moroshko/react-autosuggest).

#### Associated CSS: `search.css`

#### `searchbar` Props

`suggestions={suggestions}`: returning list of suggested autocompletes <br>
`onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}`: Using regex expression to search or showing 3 most recent when empty<br>
`onSuggestionsClearRequested={this.onSuggestionsFetchRequsted}`: Clearing suggestions when search is empty <br>
`getSuggestionValue={person => person.name}`: Returning suggestion value <br>
`renderSuggestion={this.renderSuggestion}`: Fetches styling of returned suggestions (ie profile picture displayed) <br>
`inputProps={inputProps}`: Setting placeholder, spellCheck, etc. <br>
`onSuggestionSelected={this.onSuggestionSelected}`: Function to link to chosen profile when clicked (or enter is hit after using arrow keys to scroll) <br>
`focusInputOnSuggestionClick={false}`: Allows highlighting when scrolling <br>
`alwaysRenderSuggestions={true}`: Allows for most recent profile visits to be shown when search is empty <br>

## SignUp

## SinglePatientQueryBuilder

## StatsHelper

Calculating mean and standard deviation in the context of a user-selected time-series.
