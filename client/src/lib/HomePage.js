import React, { useState } from "react";
import './HomePage.css';
import Tags from './tags/Tags';
import SearchCommand from "./search/SearchCommand";
import ListCommands from './commands/ListCommands';

const HomePage = () => {

  const processSearchResult = (command) => {
    if (command) {
      let tempCommands = [];
      tempCommands.push(command);
      setCommands(tempCommands);
    }
    console.log('processing search result ', command);
  }

  const processTagsResult = (pCommands) => {
    if (pCommands && pCommands.length > 0) {
      setCommands(pCommands);
      //console.log('commands found from tag search ', pCommands.length);
    }
  }

  const [commands, setCommands] = useState([]);

  return (
    <React.Fragment>
      <SearchCommand processResult={processSearchResult} />
      <Tags processTagsResult={processTagsResult} />
      {commands.length > 0 &&
        <ListCommands results={commands} />
      }
    </React.Fragment>
  )
}

export default HomePage;