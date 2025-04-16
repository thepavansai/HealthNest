pipeline {
    agent any
	tools{
		maven 'maven1'
	}
    
    stages {
            stage('Compile and Clean') { 
                steps {
                       sh 'mvn compile'
                      }
            }
       
	        stage('Junit5 Test') { 
                 steps {
	                sh 'mvn test'
                  }
            }

	    stage('Jacoco Coverage Report') {
        	     steps{
            		//jacoco()
            		echo 'TestCoverage'
		          }
	        }
		stage('SonarQube'){
			steps{
			//	bat label: '', script: '''mvn sonar:sonar \
			//	-Dsonar.host.url=http://CDLVDIDEVMAN500:9000 \
			//	-Dsonar.login=c0909bf6713cd534393d47364d1da553431a220d'''
			echo 'Sonar Code Scanning '
				}	
   			}
        stage('Maven Build') { 
            steps {
                bat 'mvn clean install'
                  }
            }
        stage('Build Docker image'){
           steps {
                   	    sh 'docker build -t  healthnest --build-arg VER=1.0 .'
		         }
             }
        stage('Docker Login'){
            steps {
              echo "docker login from console"
            }                
        }
        stage('Docker Push'){
            steps {
                bat 'docker push gowthamthotakuri/healthnest'
            }
        }
        stage('Docker deploy'){
            steps {
                bat 'docker run -itd -p  8080:8080 healthnest'
             }
        }
    
     
    }
}
