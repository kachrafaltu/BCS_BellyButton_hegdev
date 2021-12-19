
// declare global variables
let g_names=[];
let g_metadata=[];

let g_subj_data=[];


//get metadata based in id
function findmetadata(arr, key){
//    console.log(key)
    return arr.find(
        function(o)
        { 
//            console.log(o.id);
            return o.id==key; 
        });
  }
  
//get sample data based on  id
  function findsamples(arr, key){
//    console.log(key)
    return arr.find(
        function(o)
        { 
//            console.log(o.id);
            return o.id==key; 
        });
  }


// get subject data based on name  
function findsubjdata(arr,key){
    return arr.find(
        function(o){
            return o.name==key;
        }
    );
};



function init() {
    // we first add the values to the drop down 
    var dropdown = d3.select("#selDataset");
    g_subj_data =[];

    // read the data 
    // loop through all the names and add the data for every name to a global array
    d3.json("samples.json").then((json_data)=> {
        console.log(json_data)
        names = json_data.names;
        console.log(g_names);
        g_metadata = json_data.metadata;
        samples = json_data.samples;
        console.log('Metadata ->', g_metadata);
        for (let i=0;i< names.length;i++){
//            console.log(names[i]);
            g_names.push(names[i]);
            let l_metadata=findmetadata(g_metadata, names[i])
        
            let subj_samples = findsamples(json_data.samples,names[i]);
            let subj_sample_data=[];
            for(let j=0;j<subj_samples.otu_ids.length;j++){
//                otu_name=otu_id:'OTU' + subj_samples.otu_ids[j]
                let subj_sample = {otu_id:'OTU -'+ subj_samples.otu_ids[j],otu_color:subj_samples.otu_ids[j],otu_label:subj_samples.otu_labels[j],sample_count:subj_samples.sample_values[j] }
                subj_sample_data.push(subj_sample);
            }
            let sorted_data=subj_sample_data.sort(function(ssd1,ssd2)
                { 
                    if (ssd1.sample_count > ssd2.sample_count){
                        return(-1);
                    }
                    if(ssd1.sample_count < ssd2.sample_count){
                        return(1);
                    }
                    if (ssd1.sample_count==ssd2.sample_count){
                        return (0);
                    }
                }
            );

            let top_ten=sorted_data.slice(0,10)



            console.log('Sorted sample data')
            console.log(sorted_data)
            console.log(top_ten)
            subj_otu_arr=[]
            subj_ol_arr=[]
            subj_oc_arr=[]
            subj_oclr_arr=[]
            for (let i=0;i<top_ten.length;i++){
                subj_otu_arr.push(top_ten[i].otu_id);
                subj_oclr_arr.push(top_ten[i].otu_color);
                subj_ol_arr.push(top_ten[i].otu_label);
                subj_oc_arr.push(top_ten[i].sample_count);
            };

            console.log(l_metadata);
            let all_subj_data={name:names[i],
                metadata:l_metadata,
                top_ten:{otuids:subj_otu_arr,otulabels:subj_ol_arr,otucount:subj_oc_arr,otucolor:subj_oclr_arr}};
            g_subj_data.push(all_subj_data);

        }


        console.log(g_subj_data)

        // fill the values for the options
        json_data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });
        // display metadata info and the plots
       console.log("Displaying metadata")
       display_metadata(g_subj_data[0].metadata);
       plot_graph(g_subj_data[0]);
    });
 
    

};


function display_metadata(metadata) {

    console.log(metadata)


    // find the metadata tag
    var metadatainfo = d3.select("#sample-metadata");

    //reset the metadata panel
    metadatainfo.html("");

    for (let [key,value] of Object.entries(metadata)) {
//        console.log(`${key}: ${value}`);
        metadatainfo.append("h5").text(key.toUpperCase() + ": " + value + "\n");
    };
};

function plot_graph(subj_data){

    var trace = {
        x: subj_data.top_ten.otucount,
        y: subj_data.top_ten.otuids,
        text: subj_data.top_ten.otulabels,
        marker: {
          color: 'rgb(142,124,195)'},
        type:"bar",
        orientation: "h",
    };

        var data = [trace];

        var layout = {
            title: "Top 10 OTU",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 30
            }
        };
    
        // create the bar plot
        Plotly.newPlot("bar", data, layout);
    
        console.log('Plotting bubble')
        var trace1 = {
            x: subj_data.top_ten.otuids,
            y: subj_data.top_ten.otucount,
            mode: "markers",
            marker: {
                size: subj_data.top_ten.otucount,
                color: subj_data.top_ten.otucolor
            },
            text: subj_data.top_ten.otulabels
  
        };
  
        var layout_b = {
            xaxis:{title: "OTU ID"},
            height: 600,
            width: 1000
        };
  
        var data1 = [trace1];
  
        Plotly.newPlot("bubble", data1, layout_b); 


}



function optionChanged(id) {
    console.log('You selected :' , id)
    console.log(g_names)
    let l_subj_data=findsubjdata(g_subj_data,id);
    display_metadata(l_subj_data.metadata);
    plot_graph(l_subj_data);
//    getPlot(id);
//    getInfo(id);
}


init()





