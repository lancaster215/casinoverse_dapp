import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

export const Loader = () => {
    return(
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'fixed',
            top: 0,
            left: 0,
            background: 'rgba(0, 0, 0, .3)',
            width: '100%',
            minHeight: '100vh',
            zIndex: 999

        }}>
            <FontAwesomeIcon size="3x" color="#FFFFFF" spin icon={faSpinner}></FontAwesomeIcon>
        </div>
    )
}