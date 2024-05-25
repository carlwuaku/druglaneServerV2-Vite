import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import React from 'react'

const Loading = () => {
  return (
      <Box sx={{ display: 'flex' }}>
          <CircularProgress />
      </Box>
  )
}

export default Loading