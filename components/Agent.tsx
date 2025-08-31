import { cn } from '@/lib/utils';
import Image from 'next/image'
import React from 'react'

enum CallStatus {
  INACTIVE = 'INACTIVE',
  ACTIVE = 'ACTIVE',
  CONNECTING = 'CONNECTING',
  RINGING = 'RINGING',
  FINISHED = 'FINISHED',
}

const Agent = ({userName}: AgentProps) => {
  const callStatus = CallStatus.INACTIVE; // Example status, replace with actual state management
  const isSpeaking = true;

  const messages = [
    'What is your name?',
    'My name is John Doe.',
  ]

  const lastMessage = messages[messages.length - 1];
  const isUserMessage = lastMessage && lastMessage.startsWith('My name is');

  return (
    <>
        <div className='call-view'>
          <div className='card-interviewer'>
            <div className='avatar'>
              <Image src="/ai-avatar.png" alt="vapi" width={64} height={54} className='object-cover' />
                {isSpeaking && <span className='animate-speak'></span>}
            </div>
            <h3>AI Interview</h3>
          </div>
          <div className='card-border'>
            <div className='card-content'>
              <Image src="/user-avatar.png" alt="user avatar" width={540} height={540} className='rounded-full object-cover size-[120px]' />
              <h3>{userName}</h3>
            </div>
          </div>
        </div>

        {
          lastMessage.length > 0 && (
            <div className="transcript-border">
              <div className="transcript">
                <p key={lastMessage} className={cn('transition-opacity duration-500 opacity-0', 'animate-fade-in opacity-100')}>
                  {lastMessage}
                </p>
              </div>
            </div>
          )
        }
        <div className='w-full flex justify-center'>
          {callStatus !== 'ACTIVE' ? (
            <button className='relative btn-call'>
              <span className={cn('absolute animate-ping rounded-full opacity-75', callStatus !== 'CONNECTING' && 'hidden')}/>
              <span>
                {callStatus === 'INACTIVE' || callStatus === 'FINISHED' ? 'Call' : '...'}
              </span>
            </button>
          ) : (
            <button className='btn-disconnect'>End</button>
          )}
        </div>
    </>
  )
}

export default Agent