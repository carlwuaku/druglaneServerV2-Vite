import React, { ReactNode } from 'react'
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

const DashboardTile = (props: {
    title: string,
    subtitle: string,
    icon: ReactNode,
    expandContent?: ReactNode,
    onClick?: () => void
}) => {
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

  return (
      <Card className='expandOnHover' onClick={() => props.onClick ? props.onClick() : ''}>
          
          
          <CardContent>
              
              
              <div className="dashboardContainer">
                  <div className="dashboardIconContainer">
                      <div className="dashboardIcon">{props.icon} </div>
                  </div>
                  <div className="">
                      <p className="dashboardHeader">
                          {props.title}
                      </p>
                      <p className="dashboardDescription">{props.subtitle}</p>
                  </div>
              </div>
              

          </CardContent>
          
              { props.expandContent ? 
              <>
                  <CardActions >
                  <ExpandMore
                  expand={expanded}
                  onClick={handleExpandClick}
                  aria-expanded={expanded}
                  aria-label="show more"
              >
                  <ExpandMoreIcon />
              </ExpandMore>
              </CardActions>
              <Collapse in={expanded} timeout="auto" unmountOnExit>
              {props.expandContent}
                  </Collapse>
              </>
              : ''
              }
              
          
          
      </Card>
  )
}

export default DashboardTile