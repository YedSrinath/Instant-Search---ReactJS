var SearchBox = React.createClass({
    doSearch:function(){
        var query=document.getElementById('instant-search').value; // this is the search text
        this.props.doSearch(query);
    },
    render:function(){
        return <input type="text" id="instant-search" placeholder="Search Name" value={this.props.query} onChange={this.doSearch}/>
    }
});

var InstantBox = React.createClass({
    componentWillReceiveProps: function(){
      this.setState({allData: this.props.data});
      if(this.state.filteredData.length === 0) {
        this.setState({filteredData: this.props.data});
      };
    },
    doSearch:function(queryText){
        //get query result
        var queryResult=[];
        this.state.allData.forEach(function(person){
            if(person.username.toLowerCase().indexOf(queryText.toLowerCase())!=-1)
            queryResult.push(person);
        });

        this.setState({
            query:queryText,
            filteredData: queryResult
        })
    },
    getInitialState:function(){
        return{
            query:'',
            allData: this.props.data,
            filteredData: this.props.data
        }
    },
    render:function(){
        return (
            <div className="InstantBox">
                <h2>Instant Search</h2>
                <SearchBox query={this.state.query} doSearch={this.doSearch}/>
                <ReactTable data={this.state.filteredData}/>
            </div>
        );
    }
});

var ReactTableWrapper = React.createClass({
  loadDataFromServer: function() {
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
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadDataFromServer();
    setInterval(this.loadDataFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="wrapper">
        <InstantBox data={this.state.data} />
      </div>
    );
  }
});

var ReactTable = React.createClass({
  render: function() {
    var rows=[];
    this.props.data.map(function(record) {
      rows.push(<tr><td>{record.username}</td><td>{record.age}</td></tr>)
    });
    return (
      <div className="reactTableWrapper">
        <h2>Table</h2>
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Age</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    );
  }
});

ReactDOM.render(
  <ReactTableWrapper url="/api/records" pollInterval={1000} />,
  document.getElementById('content')
);
