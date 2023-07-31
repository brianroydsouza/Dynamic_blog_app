import React from 'react'
import {
    EmailShareButton,
    FacebookShareButton,
    LinkedinShareButton,
    RedditShareButton,
    TelegramShareButton,
    TwitterShareButton,
    WhatsappShareButton,
  } from "react-share";
  import {
    EmailIcon,
    FacebookIcon,
    LinkedinIcon,
    RedditIcon,
    TelegramIcon,
    TwitterIcon,
    WhatsappIcon,
  } from "react-share";
const ShareButtons = ({ postUrl }) => {
    return (
      <div className='shareBtn'>
        <EmailShareButton url={postUrl}>
          <EmailIcon size={32} round={true}/>
        </EmailShareButton>
  
        <FacebookShareButton url={postUrl}>
          <FacebookIcon size={32} round={true}/>
        </FacebookShareButton>
  
        <LinkedinShareButton url={postUrl}>
          <LinkedinIcon size={32} round={true}/>
        </LinkedinShareButton>

        <RedditShareButton url={postUrl}>
          <RedditIcon size={32} round={true}/>
        </RedditShareButton>

        <TelegramShareButton url={postUrl}>
          <TelegramIcon size={32} round={true}/>
        </TelegramShareButton>

        <TwitterShareButton url={postUrl}>
          <TwitterIcon size={32} round={true}/>
        </TwitterShareButton>

        <WhatsappShareButton url={postUrl}>
          <WhatsappIcon size={32} round={true}/>
        </WhatsappShareButton>
      </div>
    );
  };
  
  export default ShareButtons;
