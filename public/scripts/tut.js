class Box extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <div className="Box">
        <LikeButton />
        <h1>This is Box!</h1>
        <CommentBox url="/api/comments" pollInterval={2000} />
      </div>
    );
  }
}

class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {liked: true}
  }

  handleClick() {
    this.setState({liked: !this.state.liked})
  }

  render () {
    var text = this.state.liked? 'like' : 'have not liked';
    return (
      <p onClick={this.handleClick.bind(this)}>
        You {text} this. Click to toggle.
      </p>
    )
  }
}

class CommentBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {data: []}
  }
  loadCommentsFromServer() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  }
  handleCommentSubmit(comment) {
    var comments = this.state.data;
    var newComments = comments.concat([comment]);
    this.setState({data: newComments});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  }

  componentDidMount() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer.bind(this), this.props.pollInterval);
  }
  render() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit.bind(this)}/>
      </div>
    );
  }
}

class CommentList extends React.Component {
  constructor(props) {
    super(props)
  }

  render () {
    var commentNodes = this.props.data.map(function (comment) {
      return (
        <Comment author={comment.author}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
}

class CommentForm extends React.Component {
  constructor (props) { super(props) }
  handleSubmit(e) {
    e.preventDefault();
    var author = React.findDOMNode(this.refs.author).value.trim();
    var text = React.findDOMNode(this.refs.text).value.trim();
    if (!text || !author){
    }
    this.props.onCommentSubmit({author: author, text: text});
    React.findDOMNode(this.refs.author).value = '';
    React.findDOMNode(this.refs.text).value = '';
    return;
  }
  render() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit.bind(this)}>
        <input type="text" placeholder="Name" ref="author" />
        <input type="text" placeholder="Say something..." ref="text" />
        <input type="submit" value="Post" />
      </form>
    );
  }
}

class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {visible: false}
  }

  handleShowClick() {
    this.setState({visible: !this.state.visible})
  }

  rawMarkup() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return { __html: rawMarkup };
  }

  render() {
    if(this.state.visible){
      return (
        <div className="comment" onMouseEnter={this.handleShowClick.bind(this)}
          onMouseLeave={this.handleShowClick.bind(this)}>
        <h2 className="commentAuthor">
        {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
        </div>
      );
    } else{
      return (
        <div className="comment" onMouseEnter={this.handleShowClick.bind(this)}
          onMouseLeave={this.handleShowClick.bind(this)}>
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        </div>
      );
    }
  }
}

class Link extends React.Component {
  constructor(props) { super(props) }

  render() {
    return (
      <div className="Link">
        <h1>Links:</h1>
        <ul>
          <li><Link to="/home">HOME</Link></li>
          <li><Link to="/like">LIKE BUTTON</Link></li>
          <li><Link to="/comments">COMMENTS</Link></li>
        </ul>
      </div>
    )
  }
}

React.render(
  <Box />,
  document.getElementById('content')
);
