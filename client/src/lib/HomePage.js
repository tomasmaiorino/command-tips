import React, { useState } from "react";
import './HomePage.css';
import Tags from './tags/Tags';
import SearchCommand from "./search/SearchCommand";
import ListCommands from './commands/ListCommands';

const HomePage = () => {

  const processSearchResult = (command) => {
    console.log('processSearchResult %j', command)
    if (command) {
      let tempCommands = [];
      tempCommands.push(command);
      setCommands(tempCommands);
    }
    //console.debug('processing search result ', command);
  }

  const [commands, setCommands] = useState([]);

  return (
    <React.Fragment>
      <SearchCommand processResult={processSearchResult} />
      {commands.length > 0 &&
        <ListCommands results={commands} />
      }
    </React.Fragment>
  )
}

export default HomePage;