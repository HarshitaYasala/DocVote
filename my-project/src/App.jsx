import React, {useState, Component, useContext} from 'react';
import {FaArrowDown, FaArrowUp, FaCloudUploadAlt, FaFileCsv, FaFileImage, FaFilePdf, FaThumbsUp } from 'react-icons/fa';
import './App.css';

function PdfViewer({ url }) {
  return (
    <div>
      <iframe
        title="pdf-viewer"
        src={url}
        className="pdf-viewer"
      ></iframe>
    </div>
  );
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pdfFiles: [],
      selectedPdf: null,
      selectedPdfIndex: null,
      voteStatus: [],
      upvotedDocuments: new Set(),
      showUpvotedDocuments: [],
      showUpvotedDocumentsLink: false,
    };
  }

  handleFileChange = (event) => {
    {
      const files = event.target.files;
      const newPdfFiles = [];
      const pdfFiles = [...files].filter(file => file.type === 'application/pdf');
      if(pdfFiles.length !== files.length){
        alert("Please select only PDF Files.");
      }
      pdfFiles.forEach(file =>{
        newPdfFiles.push(file);
      })
      const newVoteStatus = newPdfFiles.map(() => null);
      this.setState((prevState) => ({
        pdfFiles: [...prevState.pdfFiles, ...newPdfFiles],
        voteStatus: [...prevState.voteStatus, ...newVoteStatus]
  
      }));
    }
  };


  handleUploadClick = () => {
    document.getElementById('file-input').click();
  };

  handlePdfClick = (index) => {
    this.setState({ selectedPdf: this.state.pdfFiles[index] });
    this.setState({ selectedPdfIndex: index});
  };
  handleVote = (index, voteType) => {
    const newVoteStatus = [...this.state.voteStatus];
    
    if (newVoteStatus[index] === voteType) {   // If already voted, remove vote
      newVoteStatus[index] = null;
    } else {
      newVoteStatus[index] = voteType;  //else update the vote
    }

    if (voteType === true) {
      this.setState({ showUpvotedDocumentsLink: true });
    }
    this.setState({ voteStatus: newVoteStatus }, () => {
    if(voteType ==true && this.state.upvotedDocuments.has(this.state.pdfFiles[index])){
      const updatedUpvotedDocuments = new Set(this.state.upvotedDocuments);
      updatedUpvotedDocuments.delete(this.state.pdfFiles[index]);
      this.setState({upvotedDocuments: updatedUpvotedDocuments});
    }
    })
  
    const upvotedDoc = this.state.pdfFiles[index];
    this.setState((prevState) => ({
      upvotedDocuments: prevState.upvotedDocuments.add(upvotedDoc)
    }));
  };

handleDownvote = (index) => {
  this.handleVote(index, false);
}
handleShowUpvotedDocuments = () => {
 const updatedUpvotedDocuments = new Set();   // Update the list of upvoted documents every time the button is clicked
 this.state.voteStatus.forEach((vote, index) => {
   if (vote === true) {
     updatedUpvotedDocuments.add(this.state.pdfFiles[index]);
   }
 });
 this.setState({ upvotedDocuments: updatedUpvotedDocuments }, () => {
  const { upvotedDocuments } = this.state;
  const upvotedDocsArray = Array.from(upvotedDocuments);
  this.setState({ showUpvotedDocuments: upvotedDocsArray});
  
    });
};

render() {
  const { pdfFiles, selectedPdf, voteStatus, showUpvotedDocuments, upvotedDocuments, selectedPdfIndex, showUpvotedDocumentsLink } = this.state;

  return (
    <div className="pdf-uploader">
      <div>
      <h1 className='pdf-title'>Upload PDF <FaFilePdf className='image'/></h1>
      <div className="pdf-uploader-button">
        <button className= 'upload' onClick={this.handleUploadClick}><p>Upload<FaCloudUploadAlt className='cloud'/></p></button>
        <input
          type="file"
          id="file-input"
          onChange={this.handleFileChange}
          style={{ display: 'none' }}
          multiple
        />
        <button className='upvoted-document' onClick={this.handleShowUpvotedDocuments}>Show Upvoted Documents</button>
        {selectedPdf && <PdfViewer url={URL.createObjectURL(selectedPdf)} />}
        
      </div>
      <div>
       
          <div>
         
            {pdfFiles.length>0 && <h2>List of Uploaded PDF's</h2>}
            <ul className='"pdf-list-item"'>
            {pdfFiles.map((file, index) => (
            <li key={index}
            onClick={() => this.handlePdfClick(index)}
            className= {selectedPdfIndex === index ? "selected": ""}> 
            <p className='pdf-file-name'>{file.name}</p> 
            <br/>
            
           <div className='vote-buttons'>
            <button className='upvote' 
             onClick={() => this.handleVote(index, true)}
             style={{ cursor: 'pointer', color: voteStatus[index] === true ? 'green' : 'black'}}>
              <FaArrowUp/> UpVote
             </button>
  
            <button className='downvote' 
             onClick={() => this.handleDownvote(index)}
             style={{ cursor: 'pointer', color: voteStatus[index] === false ? 'red' : 'black'}}>
              <FaArrowDown/> DownVote
             </button>            
             </div>
             
             </li>   
             
                       
        ))}
        
          </ul>
          </div>
      </div>
      </div>
        <div> 
        {showUpvotedDocumentsLink && (
            <div>
              <a className='link' href="#upvoted-documents" onClick={this.handleShowUpvotedDocuments}>Click here to view upvoted documents</a>
            </div>
          )}   
         {showUpvotedDocuments.length>0 && <h2 className='upvoted-documents'>Upvoted Documents</h2>}
          <ul>
            {showUpvotedDocuments.map((doc, index) => (
              <li key={index}>{doc.name}</li>
            ))}
          </ul>
        </div>
    </div>
    
  );
}
}


export default App;