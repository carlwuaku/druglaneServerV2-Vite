import React, { useEffect, useState } from "react"
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { ExpandLess, ExpandMore, StarBorder } from "@mui/icons-material";
import { ListSubheader, ListItemButton, ListItemIcon, ListItemText, Collapse } from "@mui/material";
import { ipcRenderer } from "electron";
import { DATABASE_SETUP_EVENT } from "@/utils/stringKeys";

export const DatabaseSetup = () => {
    //keep track of the list of events and whether it's complete or not
    const [events, setEvents] = useState<{ content: string }[]>([
        {
            content: "Setting up database"
        },
        {
            content: "Setting up database 2"
        },
        {
            content: "Setting up database 3"
        }
    ]);
    useEffect(() => {
        ipcRenderer.on(DATABASE_SETUP_EVENT, (event, data) => {
            setEvents(previous => [...previous, data])
      })
    
      return () => {
          ipcRenderer.removeAllListeners(DATABASE_SETUP_EVENT);
      }
    }, [])
    
    return (
        <div>
            <h1>Database Setup</h1>
            <List
                sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                        Nested List Items
                    </ListSubheader>
                }
            >
                {
                    events.map((event, i) => {
                        return (
                            <ListItem key={i} >
                                <ListItemText
                                    primary={event.content}
                                />
                            </ListItem>
                        )
                    })
                }
                <ListItemButton>
                    <ListItemIcon>
                        
                    </ListItemIcon>
                    <ListItemText primary="Sent mail" />
                </ListItemButton>
                
            </List>
        </div>
    )
}