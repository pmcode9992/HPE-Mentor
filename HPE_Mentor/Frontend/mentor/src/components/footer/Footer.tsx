import React from 'react'
import { useContext } from 'react';
import { ResponsiveContext, Text, Box } from 'grommet';

function Footer() {
    const size = useContext(ResponsiveContext);
    const year = new Date().getFullYear();

    return (
        
      <Box
        background="background-front"
        direction={!['xsmall', 'small'].includes(size) ? 'row' : 'column'}
        align={!['xsmall', 'small'].includes(size) ? 'center' : undefined}
        pad={{ horizontal: 'medium', vertical: 'small' }}
        fill="horizontal"
      >
        <Box
          direction={!['xsmall', 'small'].includes(size) ? 'row' : 'column'}
          align={!['xsmall', 'small'].includes(size) ? 'center' : undefined}
          gap="xsmall"
        >
          <Text size="small">
            &copy; {year} Hewlett Packard Enterprise Development LP
          </Text>
        </Box>
        <Box
          direction="row"
          align={!['xsmall', 'small'].includes(size) ? 'center' : undefined}
          gap="xsmall"
          wrap
        >
        </Box>
      </Box>
      );
}

export default Footer