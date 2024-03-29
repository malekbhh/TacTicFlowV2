<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator; 
class TaskController extends Controller
{
   

  public function getTasksByProjectId($projectId) {
    $tasks = Task::where('project_id', $projectId)->get(['id', 'title', 'due_date', 'status']); // Ajoutez 'due_date' à la sélection
    return response()->json($tasks);
}

    
    
   // Dans votre contrôleur TaskController.php

public function createTask(Request $request, $projectId) {
  $validator = Validator::make($request->all(), [
      'title' => 'required|string',
      'dueDate' => 'nullable|date', // Assurez-vous que la date est valide
  ]);

  if ($validator->fails()) {
      return response()->json($validator->errors(), 400);
  }

  try {
      $task = new Task();
      $task->title = $request->title;
      $task->project_id = $projectId;
      $task->status = 'To Do';
      $task->due_date = $request->dueDate; // Assurez-vous que le nom du champ correspond à celui dans votre modèle Task
      $task->save();
  
      return response()->json($task, 201);
  } catch (\Exception $e) {
      return response()->json(['error' => 'Failed to create task.'], 500);
  }
}

    
    public function updateTaskStatus(Request $request, $taskId) {
        $validator = Validator::make($request->all(), [
          'status' => 'required|in:To Do,Doing,Done,Closed', // Ensure valid status
        ]);
      
        if ($validator->fails()) {
          return response()->json($validator->errors(), 400);
        }
      
        try {
          $task = Task::findOrFail($taskId);
          $task->status = $request->get('status'); // Access status from request body
          $task->save();
      
          return response()->json($task);
        } catch (\Exception $e) {
          return response()->json(['error' => 'Failed to update task status.'], 500);
        }
      }
        
      public function deleteTask($taskId) {
        try {
          $task = Task::findOrFail($taskId);
          $task->delete();
      
          return response()->json(['message' => 'Task deleted successfully']);
        } catch (\Exception $e) {
          return response()->json(['error' => 'Failed to delete task.'], 500);
        }
      }
      
}    