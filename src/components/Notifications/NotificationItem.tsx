import React from 'react'
import { Box, Flex } from 'theme-ui'
import type { INotification } from 'src/models'
import { ReactComponent as IconComment } from 'src/assets/icons/icon-comment.svg'
import { ReactComponent as IconUseful } from 'src/assets/icons/icon-useful.svg'
import { Link } from 'react-router-dom'

export interface IProps extends INotification {}

export const NotificationItem: React.FC<IProps> = ({
  triggeredBy,
  relevantUrl,
  type,
}) => {
  return (
    <Flex
      bg={'white'}
      data-cy="notification"
      sx={{
        flexDirection: 'column',
        width: '100%',
        fontSize: '12px',
        marginBottom: '10px',
        paddingBottom: '10px',
        borderBottom: '1px solid #c7c7c7',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {type === 'howto_useful' || type === 'research_useful' ? (
        <Flex style={{ textAlign: 'left', color: 'black' }}>
          <IconUseful
            width="15px"
            height="15px"
            style={{ marginRight: '10px', opacity: '0.6' }}
          />
          <Box>
            Yay,
            <Link
              style={{
                textDecoration: 'underline',
                padding: '3px',
                color: '#61646b',
              }}
              to={'/u/' + triggeredBy.userId}
            >
              {triggeredBy.displayName}
            </Link>
            found your
            <Link
              style={{
                textDecoration: 'underline',
                padding: '3px',
                color: '#61646b',
                fontWeight: 500,
                display: 'inline',
              }}
              to={relevantUrl || ''}
            >
              {type === 'howto_useful' ? 'how-to' : 'research'}
            </Link>
            useful
          </Box>
        </Flex>
      ) : (
        <Flex>
          <IconComment
            width="15px"
            height="15px"
            style={{ marginRight: '10px', opacity: '0.6' }}
          />
          <Box style={{ textAlign: 'left' }}>
            New comment on your
            <Link
              style={{
                textDecoration: 'underline',
                padding: '3px',
                color: '#61646b',
              }}
              to={relevantUrl || ''}
            >
              {type == 'new_comment_research' ? 'Research' : 'how-to'}
            </Link>
            by
            <Link
              style={{
                textDecoration: 'underline',
                padding: '3px',
                color: '#61646b',
                fontWeight: 500,
                display: 'inline',
              }}
              to={'/u/' + triggeredBy.userId}
            >
              {triggeredBy.displayName}
            </Link>
          </Box>
        </Flex>
      )}
    </Flex>
  )
}
