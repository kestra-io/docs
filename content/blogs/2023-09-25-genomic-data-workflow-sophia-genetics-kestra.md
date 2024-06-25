
Genomic sequence analysis is a key process for leading companies in the pharmaceutical industry. Yet, bioinformaticians have long grappled with existing tools that either lack user-friendly interfaces or fail to integrate smoothly with external systems. Enter Kestra, a game-changing solution designed to fill this gap. While many tools in the field either skew too scientific, neglect modern integration capabilities, or rely on the limitations of interpreted languages like Python, [Kestra](https://github.com/kestra-io/kestra) offers a balanced approach. It combines scientific rigor with the flexibility to integrate with contemporary tooling, making it easier to scale, update architecture, and onboard new talent into this specialized field. In essence, Kestra addresses the bioinformatics community's pressing need for a tool that harmonizes scientific depth with modern technological agility.

Quite surprisingly, none of the existing tools in this space appeared to adequately address the aforementioned pain point.



## Workflow Challenges in Genomic Sequence Analysis

As a bioinformatician orchestrating the different steps in genomic sequence analysis, you would follow a logical workflow to process and analyze the data.

![workflow genomic](/blogs/2023-09-25-genomic-data-workflow-sophia-genetics-kestra/workflow_genomic.jpg)


**1. Data Preprocessing**: 
    
* Quality checks: to perform quality assessment of raw sequencing reads.
    
* Trimming and filtering: remove adapter sequences, low-quality bases, or other artifacts.

**2. Sequence Alignment**: 
    
* Reference selection: to choose an appropriate reference genome or transcriptome.
    
* Alignment: to align the preprocessed reads to the selected reference.

**3. Variant Calling**: 
    
* Variant calling algorithms: to identify single nucleotide variants, insertions, deletions, or structural variants.
    
* Variant quality filtering: to select high-quality variants for downstream analysis.

**4. Annotation and Functional Analysis**: 
    
* Annotation databases: to annotate variants with information regarding their genomic location, functional impact, and known associations.
    
* Functional analysis: to perform functional analysis, including pathway enrichment, protein domain analysis, or prediction of variant effects on protein structure and function.

**5. Visualization and Interpretation**: 
    
* Data visualization: to generate plots, graphs, and interactive visualizations for exploration and interpretation. 
    
* Integrating other data types: to gain deeper insights into the biological context.


The complexity of genomic sequence analysis is apparent. This process necessitates the use of over 12 tools tailored to each step's requirements. Imagine how overwhelming this could be if relying on manual execution… Data engineering plays a crucial role in implementing these transformations efficiently and at scale. It involves designing data pipelines, selecting appropriate algorithms and tools, optimizing performance, and ensuring data integrity and reliability throughout the process.
This is where Kestra stands out. It empowers bio-informaticians to manage a large panel of workflows from all sizes on a daily basis, all within a cost-effective production environment.


## Kestra: The Solution for Sophia Genetics

We're proud to be aiding one of the industry's leading giants, [Sophia Genetics](https://www.sophiagenetics.com/), in helping their bioinformaticians orchestrate and automate critical operations like Demultiplexing Sequencing Data

### Data Chunking: A Compute Challenge

Bioinformaticians employ a 'divide-and-conquer' strategy, often referred to as Split/Merge in data processing. This involves breaking down the dataset into manageable chunks, applying the same processing to each.
However, the true challenge arises from the unpredictability of the number of splits needed before execution. This variability can stem from factors like dataset size, complexity, and the specific algorithms being used. To ensure efficient execution, it becomes essential to provision a dedicated compute node for each split. This targeted allocation of computing resources reduces processing time.

Lack of proper resource allocation can lead to wait times of up to 10 hours for processing a 100GB file, highlighting the critical role of efficient resource management in bioinformatics workflows.

### Kestra's Role in Streamlining Processes

With Kestra, [Sophia Genetics](https://www.sophiagenetics.com/) streamlined the transformation process of 3,000 files as raw inputs (DNA fragments) into 100 structured outputs (FASTQ files), a mandatory step to perform analyses. Kestra Internal Storage plays a key role in this operation. As an illustration of their efforts to enhance overall quality, rather than manually specifying graphs using flowable tasks, they implemented a trigger-based system. This allowed flows to use inputs and outputs data from one another.
This process is executed about 200 times per month. More than 100 data scientists are benefiting from Kestra’s orchestration engine. The user-friendly interface and the declarative domain system language of Kestra empowered data scientists to eliminate the complexities of manual operations, resulting in a substantial increase in productivity. Saving even only 3 minutes of their time per day results in saving a Full-Time Equivalent (FTE).

Another use case is the distributed analysis of alignment files (BAM) of N samples to measure the sequence coverage for a given genome.
It consists of the following steps:

* Fetch sample files over HTTP. Each of those samples contains two files: aligned read (BAM) and aligned read index (BAI).
* Compute coverage on [Azure Batch](https://kestra.io/plugins/plugin-azure) on the gene of interest. Thanks to the powerful logics of Kestra, those tasks are run in parallel.
* Concatenate all the results once every file has been processed.
* Create a plot in Python to show and analyze results.


Here is an example of inputs samples:

![example inputs](/blogs/2023-09-25-genomic-data-workflow-sophia-genetics-kestra/example_input.png)

And here is the complete Kestra flow:

![Kestra flow](/blogs/2023-09-25-genomic-data-workflow-sophia-genetics-kestra/script.png)

Here you can see that we use a custom docker image used by Azure Batch to run the corresponding process. It consists of the following Python script allowing to compute the coverage.

![Python script](/blogs/2023-09-25-genomic-data-workflow-sophia-genetics-kestra/script.png)

## Azure Batch plugin in Kestra

To deal with such a large amount of data, Sophia Genetics team take advantage of the integration of [Azure Batch plugin in Kestra](https://kestra.io/plugins/plugin-azure). 

Azure Batch is a cloud-based job scheduling service that simplifies running large-scale parallel and high-performance computing applications. With its ability to automatically scale resources, Azure Batch can efficiently manage and process large volumes of data, making it an ideal choice when looking to optimize data processing capabilities.
Indeed, Sophia Genetics runs large-scale jobs efficiently in the cloud while coupling other steps together thanks to Kestra versatility.

---

The combination Kestra orchestration engine, declarative Flow based definition and Azure Batch plugin integration, offers a powerful solution for Sophia Genetics to manage, store, and process large-scale data workloads. 
Thanks to Kestra, they successfully streamlined their genomic sequence analysis, which was a real challenge involving many tools and processes.
While genomic sequence analysis was a real challenge, involving many tools and processes, the arrival of Kestra successfully streamlined those workflows. This led to improved time management, simplified data practitioner oversight, and ultimately, enhanced overall productivity.
We're very proud to have [Sophia Genetics](https://www.sophiagenetics.com/) as one of our power users and can't wait to continue working with them to improve their genomic analysis capabilities, push the boundaries of medical research, and ultimately contribute to advancements in personalized healthcare.


Join the [Slack community](https://kestra.io/slack) if you have any questions or need assistance. Follow us on [Twitter](https://twitter.com/kestra_io) for the latest news. Check the code in our [GitHub repository](https://github.com/kestra-io/kestra) and give us a star if you like the project.
