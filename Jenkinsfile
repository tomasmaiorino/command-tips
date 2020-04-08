pipeline {
    agent any
    tools {nodejs "node"}
    stages {
        stage('build-client') {
            steps {
                dir("${env.WORKSPACE}/client"){
                    sh "npm install --no-package-lock"
                }             
            }
        }
        stage('integration-tests') {
            steps {
                dir("${env.WORKSPACE}/server"){
                    sh "npm install --no-package-lock"
                    sh "npm run-script it"
                }
            }
        }
    }
}