#include <igraph.h>
#include <math.h>

int main(int argc, char* argv[]) {

    //Open files for read / write
    FILE *ifile;
    FILE *ofile;

    //Open the source file stream
    ifile=fopen(argv[1], "r");

    //Check if file is opened
    if (!ifile) {
        printf("Invalid input file!\n");
        return 1;
    }

    //Open target file
    ofile = fopen(argv[2], "w");

    //Safety check.
    if(!ofile){
        printf("Cannot create output file!\n");
        return 1;
    }

    //Make the igraph object
    igraph_t g;

    //Read the file having pure edge list
    igraph_read_graph_edgelist(&g, ifile, 0, 0);

    //File read, close it!
    fclose(ifile);

    //Create a matrix which will hold positions
    igraph_matrix_t coords;
    igraph_matrix_init(&coords, 0, 0);

    //Store the vertex counts
    igraph_real_t vc = igraph_vcount(&g);

    //Do the layout
    igraph_layout_lgl(&g, &coords,
    /* maxiter */    150,
    /* maxdelta */   vc,
    /* area */       vc*vc,
    /* coolexp */    1.5,
    /* repulserad */ vc*vc*vc,
    /* cellsize */   sqrt(sqrt(vc)),
    /* root */       0);

    //Lets see some stats
    long int numEl =  igraph_matrix_size(&coords);
    long int numRow =  igraph_matrix_nrow(&coords);
    long int numCol =  igraph_matrix_ncol(&coords);
    printf("Total: %ld | [rows: %ld , cols: %ld]\n", numEl, numRow, numCol);

    fprintf(ofile, "[");

    for(int i = 0; i < numRow; i++){
        if(i != 0) fprintf(ofile, ",\n");
        fprintf(ofile, "{ \"ref\": %d, \"x\": %f, \"y\": %f}", i, (double)igraph_matrix_e(&coords,i,0), (double)igraph_matrix_e(&coords,i,1));
    }
    fprintf(ofile, "]");

    fclose(ofile);
    igraph_matrix_destroy(&coords);
    igraph_destroy(&g);
    return 0;
}